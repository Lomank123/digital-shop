from mainapp.models import Cart


class CartRepository:

	@staticmethod
	def get_or_create_cart_by_id(cart_id=None) -> Cart:
		cart = Cart.objects.filter(id=cart_id).first()
		print("Cart is: ", cart)

		if cart is None:
			cart = Cart.objects.create()
		return cart
	
	@staticmethod
	def get_or_create_user_cart(request) -> Cart:
		pass
