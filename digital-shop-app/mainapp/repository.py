from mainapp.models import Cart


class CartRepository:

	@staticmethod
	def set_user_to_cart_or_create(cart_id, new_user) -> Cart:
		cart = Cart.objects.filter(id=cart_id).first()
		# If new cart already has user then we create another
		if cart.user:
			cart = Cart.objects.create()
		cart.user = new_user
		cart.save()
		return cart

	@staticmethod
	def get_or_create_cart_by_id(cart_id=None, create=True) -> Cart:
		cart = Cart.objects.filter(id=cart_id).first()
		print("Cart is: ", cart)

		if cart is None and create:
			cart = Cart.objects.create()
		return cart
	
	@staticmethod
	def get_user_cart_by_id(user) -> Cart:
		cart = Cart.objects.filter(user=user, is_deleted=False).first()
		return cart
