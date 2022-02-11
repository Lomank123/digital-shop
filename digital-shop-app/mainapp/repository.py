from mainapp.models import Cart, Product, CartItem, Category


class CartRepository:

	@staticmethod
	def set_user_to_cart_or_create(cart_id, new_user) -> Cart:
		"""
		This method finds current cart (assuming it is non-user) and if it has user then
		creates a new cart. And then changes ownership to current user.
		"""
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
		if cart is None and create:
			cart = Cart.objects.create()
		return cart
	
	@staticmethod
	def get_user_cart_by_id(user) -> Cart:
		cart = Cart.objects.filter(user=user, is_deleted=False).first()
		return cart


class ProductRepository:

	@staticmethod
	def get_product_by_id(product_id) -> Product:
		product = Product.objects.filter(id=product_id).first()
		return product
	
	@staticmethod
	def get_products_by_category(category, viewset_instance):
		products = viewset_instance.get_queryset().filter(category=category)
		return products

	@staticmethod
	def get_products_by_user_id(user_id, viewset_instance):
		products = viewset_instance.get_queryset().filter(created_by=user_id)
		return products

class CategoryRepository:
	
	@staticmethod
	def get_category_by_verbose(verbose) -> Category:
		category = Category.objects.filter(verbose=verbose).first()
		return category


class CartItemRepository:

	@staticmethod
	def set_cart_item_or_none(product, cart):
		# Check whether the same cart item exists
		# Because one product can't be in the same cart more than once
		item = CartItem.objects.filter(product=product, cart=cart).first()
		if item is None:
			new_cart_item = CartItem.objects.create(quantity=1, cart=cart, product=product)
			return new_cart_item
		return None

	@staticmethod
	def delete_cart_item(product, cart):
		item = CartItem.objects.filter(product=product, cart=cart).first()
		if item is not None:
			item.delete()

	@staticmethod
	def get_cart_related_items(cart):
		cart_items = CartItem.objects.filter(cart=cart)
		return cart_items

	@staticmethod
	def delete_by_product(product):
		CartItem.objects.filter(product=product).delete()