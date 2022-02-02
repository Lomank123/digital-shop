import datetime
from http import cookies


class CartCookieManager:

	__slots__ = 'request',


	def __init__(self, request):
		self.request = request

	def get_cart_id(self, user=False):
		if user:
			user_cart_id = self.request.COOKIES.get('user_cart_id', None)
			if user_cart_id is not None:
				return user_cart_id
		return self.request.COOKIES.get('cart_id', None)
	
	def get_user_cart_id(self):
		return self.request.COOKIES.get('user_cart_id', None)

	def set_cart_id_if_not_exists(self, response, cart_id, forced=False):
		if self.get_cart_id(True):
			return
		expires = datetime.datetime.now() + datetime.timedelta(days=30)
		response.set_cookie('cart_id', cart_id, expires=expires, httponly=True, samesite='Lax')

	def set_user_cart_id(self, response, user_cart_id):
		expires = datetime.datetime.now() + datetime.timedelta(days=30)
		response.set_cookie('user_cart_id', user_cart_id, expires=expires, httponly=True, samesite='Lax')

	def delete_cart_id(self, response):
		response.delete_cookie('cart_id', samesite='Lax')
	
	def delete_user_cart_id(self, response):
		response.delete_cookie('user_cart_id', samesite='Lax')