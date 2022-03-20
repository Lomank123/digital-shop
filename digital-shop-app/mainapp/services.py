import mainapp.consts as consts
from mainapp.utils import CartCookieManager
from mainapp.repository import CartRepository, ProductRepository, CartItemRepository, OrderRepository
from mainapp.serializers import CartSerializer
from rest_framework.response import Response
from rest_framework import status
import logging


logger = logging.getLogger('django')


class CartService:

    __slots__ = 'cookie_manager', 'request',

    def __init__(self, request):
        self.cookie_manager = CartCookieManager(request)
        self.request = request

    def _get_either_cart_id_from_cookie(self):
        return self.cookie_manager.get_either_cart_id()

    def _get_either_cookie_name(self):
        return self.cookie_manager.get_either_cookie_name()

    def _get_non_user_cart_id_from_cookie(self):
        return self.cookie_manager.get_cart_id()

    def _get_user_cart_id_from_cookie(self):
        return self.cookie_manager.get_user_cart_id()

    def _set_cart_id_to_cookie(self, response, cart_id, cookie_name, forced=False):
        self.cookie_manager.set_cart_id_if_not_exists(response, cart_id, cookie_name, forced)

    def _delete_cart_id_from_cookie(self, response, cookie_name):
        self.cookie_manager.delete_cart_id(response, cookie_name)

    def _attach_cart_to_user_if_none(self):
        # Assuming we'll get anonymous cart id from this
        cart_id = self._get_non_user_cart_id_from_cookie()
        cart = CartRepository.set_user_to_cart(cart_id, self.request.user)
        return cart

    def _create_and_attach_cart(self):
        cart = CartRepository.create_and_attach_cart(self.request.user)
        return cart

    def _build_response(self, cart):
        serializer = CartSerializer(cart)
        response = Response(data=serializer.data, status=status.HTTP_200_OK)
        return response

    def _build_user_cart_response(self, cart):
        response = Response(data={consts.DETAIL_KEY: consts.CHECK_CART_ON_LOGIN_SUCCESS}, status=status.HTTP_200_OK)
        if cart is None:
            cart = self._attach_cart_to_user_if_none()
            self._delete_cart_id_from_cookie(response, consts.NON_USER_CART_ID_COOKIE_NAME)
            response.data = {consts.DETAIL_KEY: consts.NEW_CART_ATTACHED}
        self._set_cart_id_to_cookie(response, cart.id, consts.USER_CART_ID_COOKIE_NAME, forced=True)
        return response

    # Used when user enters the website
    def either_cart_execute(self):
        cart_id = self._get_either_cart_id_from_cookie()
        cart = CartRepository.get_or_create_cart_by_id(cart_id)
        response = self._build_response(cart)
        self._set_cart_id_to_cookie(response, cart.id, consts.NON_USER_CART_ID_COOKIE_NAME)
        return response

    # Used upon login
    def user_cart_execute(self):
        cart = CartRepository.get_user_cart_by_id(self.request.user)
        response = self._build_user_cart_response(cart)
        return response

    # Used upon log out
    def user_cart_id_delete_execute(self):
        response = Response(data={consts.DETAIL_KEY: consts.COOKIE_DELETED}, status=status.HTTP_200_OK)
        self._delete_cart_id_from_cookie(response, consts.USER_CART_ID_COOKIE_NAME)
        return response


class CartItemService:

    __slots__ = 'request'

    def __init__(self, request):
        self.request = request

    @staticmethod
    def _build_add_response(cart_item):
        response = Response(data={consts.DETAIL_KEY: consts.CART_ITEM_ADDED}, status=status.HTTP_200_OK)
        if cart_item is None:
            response.status_code = status.HTTP_400_BAD_REQUEST
            response.data = {consts.DETAIL_KEY: consts.CART_ITEM_ADD_ERROR_MSG}
            logger.error(consts.CART_ITEM_ADD_ERROR_MSG)
        return response

    def add_execute(self):
        product = ProductRepository.get_product_by_id(self.request.data[consts.PRODUCT_ID_POST_KEY])
        cart = CartRepository.get_or_create_cart_by_id(self.request.data[consts.CART_ID_POST_KEY], create=False)
        cart_item = CartItemRepository.set_cart_item_or_none(product, cart)
        response = self._build_add_response(cart_item)
        return response

    def remove_execute(self):
        product = ProductRepository.get_product_by_id(self.request.data[consts.PRODUCT_ID_POST_KEY])
        cart = CartRepository.get_or_create_cart_by_id(self.request.data[consts.CART_ID_POST_KEY], create=False)
        CartItemRepository.delete_cart_item(product, cart)
        return Response(data={consts.DETAIL_KEY: consts.CART_ITEM_DELETED}, status=status.HTTP_200_OK)

    def remove_all_execute(self):
        cart = CartRepository.get_or_create_cart_by_id(self.request.data[consts.CART_ID_POST_KEY], create=False)
        CartItemRepository.delete_all_from_cart(cart)
        return Response(data={consts.DETAIL_KEY: consts.CART_CLEANED}, status=status.HTTP_200_OK)

    @staticmethod
    def _get_cart_related_items(cart_id):
        cart = CartRepository.get_or_create_cart_by_id(cart_id, create=False)
        cart_items = CartItemRepository.get_cart_related_items(cart)
        return cart_items

    def get_execute(self, cart_id, viewset_instance):
        cart_items = self._get_cart_related_items(cart_id)
        response = build_paginated_response(cart_items, viewset_instance)
        return response

    @staticmethod
    def _build_ids_response(cart_items):
        productIds = {}
        data = []
        for item in cart_items:
            product_id = item.product.id
            data.append(product_id)
        productIds["data"] = data
        response = Response(data=productIds, status=status.HTTP_200_OK)
        return response

    def get_ids_execute(self, cart_id):
        cart_items = self._get_cart_related_items(cart_id)
        response = self._build_ids_response(cart_items)
        return response

    def delete_by_product_execute(self):
        product = ProductRepository.get_product_by_id(self.request.data[consts.PRODUCT_ID_POST_KEY])
        CartItemRepository.delete_by_product(product)
        return Response(data={consts.DETAIL_KEY: consts.INACTIVE_CART_ITEMS_DELETED}, status=status.HTTP_200_OK)

    def change_items_owner_execute(self):
        service = CartService(self.request)
        non_user_cart_id = service._get_non_user_cart_id_from_cookie()
        user_cart_id = service._get_user_cart_id_from_cookie()
        user_cart = CartRepository.get_or_create_cart_by_id(user_cart_id, create=False)
        non_user_cart_items = self._get_cart_related_items(non_user_cart_id)
        user_cart_items = self._get_cart_related_items(user_cart_id)
        CartItemRepository.change_items_owner(non_user_cart_items, user_cart_items, user_cart)
        return Response(data={consts.DETAIL_KEY: consts.MOVED_CART_ITEMS}, status=status.HTTP_200_OK)

    def calculate_total_price_execute(self):
        cart_items = self._get_cart_related_items(self.request.data[consts.CART_ID_POST_KEY])
        total_price = CartItemRepository.calculate_total_price(cart_items)
        return Response(data={consts.TOTAL_PRICE_POST_KEY: total_price}, status=status.HTTP_200_OK)

    def post_purchase_execute(self):
        response = Response(data={consts.DETAIL_KEY: consts.POST_PURCHASE_DONE}, status=status.HTTP_200_OK)
        cart = CartRepository.get_or_create_cart_by_id(self.request.data[consts.CART_ID_POST_KEY])
        CartItemRepository.change_quantity(cart)
        self._post_purchase_set_order_if_user(cart, self.request.data[consts.TOTAL_PRICE_POST_KEY])
        service = CartService(self.request)
        cookie_name = service._get_either_cookie_name()
        service._delete_cart_id_from_cookie(response, cookie_name)
        if self.request.user.is_authenticated:
            new_cart = service._create_and_attach_cart()
        else:
            new_cart = CartRepository.get_or_create_cart_by_id()
        service._set_cart_id_to_cookie(response, new_cart.id, cookie_name, forced=True)
        return response

    def _post_purchase_set_order_if_user(self, cart, total_price):
        saved_cart = CartRepository.set_cart_archived(cart)
        if self.request.user.is_authenticated:
            OrderRepository.create_order(saved_cart, total_price)


def build_paginated_response(items, viewset_instance):
    page = viewset_instance.paginate_queryset(items)
    if page is not None:
        serializer = viewset_instance.get_serializer(page, many=True)
        return viewset_instance.get_paginated_response(serializer.data)
    logger.error(consts.PAGINATED_SERIALIZE_ERROR_MSG)
    response = Response(
        data={consts.DETAIL_KEY: consts.PAGINATED_SERIALIZE_ERROR_MSG},
        status=status.HTTP_400_BAD_REQUEST
    )
    return response
