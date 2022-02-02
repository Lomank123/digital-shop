import datetime
from http import cookies


class CartCookieManager:

	__slots__ = 'request',


	def __init__(self, request):
		self.request = request

	def get_either_cart_id(self):
		"""
		Returns user cart id if such cookie exists, otherwise checks for non-user cart cookie.
		If no cookies exist None is returned.
		"""
		user_cart_id = self.request.COOKIES.get('user_cart_id', None)
		if user_cart_id is not None:
			return user_cart_id
		return self.request.COOKIES.get('cart_id', None)
	
	def get_user_cart_id(self):
		"""
		Returns user cart id.
		"""
		return self.request.COOKIES.get('user_cart_id', None)
	
	def get_cart_id(self):
		"""
		Returns non-user cart id.
		"""
		return self.request.COOKIES.get('cart_id', None)

	def set_cart_cookie(self, response, cookie_name, value):
		"""
		Sets cookie with given cookie_name and value.
		By default cookie expiration date is now + 1 month.
		"""
		expires = datetime.datetime.now() + datetime.timedelta(days=30)
		response.set_cookie(cookie_name, value, expires=expires, httponly=True, samesite='Lax')

	def set_cart_id_if_not_exists(self, response, cart_id, cookie_name, forced=False):
		if self.get_either_cart_id() and not forced:
			return
		self.set_cart_cookie(response, cookie_name, cart_id)

	def delete_cart_id(self, response, cookie_name):
		response.delete_cookie(cookie_name, samesite='Lax')
