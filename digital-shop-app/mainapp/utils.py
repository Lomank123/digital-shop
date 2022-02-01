import datetime
from http import cookies


class CartCookieManager:

	__slots__ = 'request',


	def __init__(self, request):
		self.request = request

	def get_cart_id(self):
		user_cart_id = self.request.COOKIES.get('user_cart_id', None)
		if user_cart_id is not None:
			return user_cart_id
		return self.request.COOKIES.get('cart_id', None)

	# Need to set (or reset) user_cart_id cookie here as well
	def set_cart_id_if_not_exists(self, response, cart_id, forced=False):
		if self.get_cart_id():
			return

		expires = datetime.datetime.now() + datetime.timedelta(days=30)
		response.set_cookie('cart_id', cart_id, expires=expires, httponly=True, samesite='Lax')
