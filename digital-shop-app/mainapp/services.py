import mainapp.consts as consts
from mainapp.utils import CartCookieManager
from mainapp.repository import CartRepository, ProductRepository, CartItemRepository
from mainapp.serializers import CartSerializer, CartItemSerializer, ProductSerializer
from rest_framework.response import Response
from rest_framework import status


class CartService:

	__slots__ = 'cookie_manager', 'request',


	def __init__(self, request):
		self.cookie_manager = CartCookieManager(request)
		self.request = request

	def _get_either_cart_id_from_cookie(self):
		return self.cookie_manager.get_either_cart_id()

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
		cart = CartRepository.set_user_to_cart_or_create(cart_id, self.request.user)
		return cart

	@staticmethod
	def _build_response(cart):
		serializer = CartSerializer(cart)
		response = Response(data=serializer.data, status=status.HTTP_200_OK)
		return response

	def _build_user_cart_response(self, cart):
		response = Response(data={"detail": "Check cart on login succcessful."}, status=status.HTTP_200_OK)
		if cart is None:
			cart = self._attach_cart_to_user_if_none()
			self._delete_cart_id_from_cookie(response, consts.NON_USER_CART_ID_COOKIE_NAME)
			response.data = {"detail": "New cart has been attached to this user."}
		self._set_cart_id_to_cookie(response, cart.id, consts.USER_CART_ID_COOKIE_NAME, forced=True)
		return response

	# For getting cart (user or anonymous)
	def either_cart_execute(self):
		cart_id = self._get_either_cart_id_from_cookie()
		cart = CartRepository.get_or_create_cart_by_id(cart_id)
		response = self._build_response(cart)
		self._set_cart_id_to_cookie(response, cart.id, consts.NON_USER_CART_ID_COOKIE_NAME)
		return response

	# For getting or setting user cart upon login
	def user_cart_execute(self):
		cart = CartRepository.get_user_cart_by_id(self.request.user)
		response = self._build_user_cart_response(cart)
		return response

	# For deleting user_cart_id cookie upon log out
	def user_cart_id_delete_execute(self):
		response = Response(
			data={"detail": "Cookie successfully deleted."},
			status=status.HTTP_200_OK
		)
		self._delete_cart_id_from_cookie(response, consts.USER_CART_ID_COOKIE_NAME)
		return response


class CartItemService:
	
	__slots__ = 'request'


	def __init__(self, request):
		self.request = request

	@staticmethod
	def _build_add_response(cart_item):
		response = Response(data={"detail": "Product has been added."}, status=status.HTTP_200_OK)
		if cart_item is None:
			response.status_code = status.HTTP_400_BAD_REQUEST
			response.data = {"detail": "Cannot add product to cart."}
		return response

	def add_execute(self):
		product = ProductRepository.get_product_by_id(self.request.data["product_id"])
		cart = CartRepository.get_or_create_cart_by_id(self.request.data["cart_id"], create=False)
		cart_item = CartItemRepository.set_cart_item_or_none(product, cart)
		response = self._build_add_response(cart_item)
		return response
	
	def remove_execute(self):
		product = ProductRepository.get_product_by_id(self.request.data["product_id"])
		cart = CartRepository.get_or_create_cart_by_id(self.request.data["cart_id"], create=False)
		CartItemRepository.delete_cart_item(product, cart)
		return Response(data={"detail": "CartItem was deleted."}, status=status.HTTP_200_OK)

	@staticmethod
	def _build_response(cart_items, viewset_instance):
		page = viewset_instance.paginate_queryset(cart_items)
		if page is not None:
			serializer = viewset_instance.get_serializer(page, many=True)
			return viewset_instance.get_paginated_response(serializer.data)
		response = Response(
			data={"detail": "Cannot serialize cart items because there is none."},
			status=status.HTTP_400_BAD_REQUEST
		)
		return response

	@staticmethod
	def _get_cart_related_items(cart_id):
		cart = CartRepository.get_or_create_cart_by_id(cart_id, create=False)
		cart_items = CartItemRepository.get_cart_related_items(cart)
		return cart_items

	def get_execute(self, cart_id, viewset_instance):
		cart_items = self._get_cart_related_items(cart_id)
		response = self._build_response(cart_items, viewset_instance)
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

	def _get_ids_execute(self, cart_id):
		cart_items = self._get_cart_related_items(cart_id)
		response = self._build_ids_response(cart_items)
		return response

	def _delete_inactive_execute(self):
		product = ProductRepository.get_product_by_id(self.request.data["product_id"])
		CartItemRepository.delete_by_product(product)
		return Response(data={"detail": "CartItem instances were deleted."}, status=status.HTTP_200_OK)
