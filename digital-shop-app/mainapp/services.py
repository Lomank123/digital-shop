from mainapp.utils import CartCookieManager
from mainapp.repository import CartRepository
from mainapp.serializers import CartSerializer
from rest_framework.response import Response
from rest_framework import status


class CartService:
	
	__slots__ = 'cookie_manager',

	def __init__(self, request):
		self.cookie_manager = CartCookieManager(request)

	def _get_cart_from_cookie(self):
		return self.cookie_manager.get_cart_id()

	def _set_cart_to_cookie(self, response, cart_id):
		self.cookie_manager.set_cart_id_if_not_exists(response, cart_id)

	@staticmethod
	def _build_context(cart):
		return {
			"cart": cart,
		}

	@staticmethod
	def _build_response(cart):
		serializer = CartSerializer(cart)
		response = Response(data=serializer.data, status=status.HTTP_200_OK)
		return response

	def execute(self):
		cart_id = self._get_cart_from_cookie()
		cart = CartRepository.get_or_create_cart_by_id(cart_id)
		response = self._build_response(cart)
		self._set_cart_to_cookie(response, cart.id)
		return response
