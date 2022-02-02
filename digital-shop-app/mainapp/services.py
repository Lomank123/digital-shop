from mainapp.utils import CartCookieManager
from mainapp.repository import CartRepository
from mainapp.serializers import CartSerializer
from rest_framework.response import Response
from rest_framework import status


# TODO: Need to rename most of functions and move some string consts to consts.py
class CartService:

	__slots__ = 'cookie_manager', 'request',


	def __init__(self, request):
		self.cookie_manager = CartCookieManager(request)
		self.request = request

	def _get_cart_id_from_cookie(self, user=False):
		return self.cookie_manager.get_cart_id(user)

	def _get_user_cart_id_from_cookie(self):
		return self.cookie_manager.get_user_cart_id()

	def _set_cart_id_to_cookie(self, response, cart_id):
		self.cookie_manager.set_cart_id_if_not_exists(response, cart_id)

	def _delete_cart_id_from_cookie(self, response):
		self.cookie_manager.delete_cart_id(response)

	def _delete_user_cart_id_from_cookie(self, response):
		self.cookie_manager.delete_user_cart_id(response)

	def _set_user_cart_id_to_cookie(self, response, cart_id):
		self.cookie_manager.set_user_cart_id(response, cart_id)

	def _attach_cart_to_user_if_none(self):
		# Assuming we'll get anonymous cart id from this
		cart_id = self._get_cart_id_from_cookie()
		cart = CartRepository.set_user_to_cart_or_create(cart_id, self.request.user)
		return cart

	@staticmethod
	def _build_response(cart):
		serializer = CartSerializer(cart)
		response = Response(data=serializer.data, status=status.HTTP_200_OK)
		return response

	# For getting cart (user or anonymous)
	def execute(self):
		cart_id = self._get_cart_id_from_cookie(True)
		cart = CartRepository.get_or_create_cart_by_id(cart_id)
		response = self._build_response(cart)
		self._set_cart_id_to_cookie(response, cart.id)
		return response

	def _build_user_cart_response(self, cart):
		response = Response(data={"detail": "Check cart on login succcessful."}, status=status.HTTP_200_OK)
		if cart is None:
			cart = self._attach_cart_to_user_if_none()
			self._delete_cart_id_from_cookie(response)
			response.data = {"detail": "New cart has been attached to this user."}
		self._set_user_cart_id_to_cookie(response, cart.id)
		return response

	# For getting or setting user cart upon login
	def user_cart_execute(self):
		cart = CartRepository.get_user_cart_by_id(self.request.user)
		response = self._build_user_cart_response(cart)
		return response

	def user_cart_id_delete_execute(self):
		response = Response(data={"detail": "Cookie successfully deleted."}, status=status.HTTP_200_OK)
		self._delete_user_cart_id_from_cookie(response)
		return response
