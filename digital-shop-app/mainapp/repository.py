from django.db.models import F, Sum
from mainapp.models import Cart, Product, CartItem, Category, Order, Address
from mainapp import consts
import logging


logger = logging.getLogger('django')


class CartRepository:

    @staticmethod
    def set_user_to_cart(cart_id, new_user) -> Cart:
        """
        This method finds current cart (assuming it is non-user) and changes it's ownership.
        """
        cart = Cart.objects.filter(id=cart_id).first()
        cart.user = new_user
        cart.save()
        logger.info("Cart has been attached.")
        return cart

    @staticmethod
    def create_and_attach_cart(user):
        cart = Cart.objects.create()
        cart.user = user
        cart.save()
        logger.info("Newly created cart has been attached.")
        return cart

    @staticmethod
    def get_or_create_cart_by_id(cart_id=None, create=True) -> Cart:
        cart = Cart.objects.filter(id=cart_id).first()
        if cart is None and create:
            cart = Cart.objects.create()
            logger.info("New cart has been created.")
        return cart

    @staticmethod
    def get_cart_by_user(user) -> Cart:
        cart = Cart.objects.filter(user=user, is_deleted=False, is_archived=False).first()
        return cart

    @staticmethod
    def set_cart_archived(cart):
        cart.is_archived = True
        cart.save()
        logger.info("Cart is now archived.")
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
    def get_category_by_slug(slug) -> Category:
        category = Category.objects.filter(slug=slug).first()
        return category


class CartItemRepository:

    @staticmethod
    def set_cart_item_or_none(product, cart):
        # Check whether the same cart item exists
        # Because one product can't be in the same cart more than once
        item = CartItem.objects.filter(product=product, cart=cart).first()
        if item is None:
            new_cart_item = CartItem.objects.create(quantity=1, cart=cart, product=product)
            logger.info(consts.CART_ITEM_ADDED)
            return new_cart_item
        return None

    @staticmethod
    def delete_cart_item(product, cart):
        item = CartItem.objects.filter(product=product, cart=cart).first()
        if item is not None:
            item.delete()
            logger.info("CartItem removed.")

    @staticmethod
    def delete_all_from_cart(cart):
        items = CartItem.objects.filter(cart=cart)
        if items is not None:
            items.delete()
            logger.info("Cart has been cleaned.")

    @staticmethod
    def get_cart_related_items(cart):
        cart_items = CartItem.objects.filter(cart=cart)
        return cart_items

    @staticmethod
    def delete_by_product(product):
        CartItem.objects.filter(product=product).delete()
        logger.info("CartItem removed.")

    @staticmethod
    def change_items_owner(non_user_cart_items, user_cart_items, new_cart):
        products = user_cart_items.values('product__id')
        items = non_user_cart_items.exclude(product__id__in=products)
        for item in items:
            item.cart = new_cart
            item.save()
            logger.info("Ownership of cart items has been changed.")

    @staticmethod
    def calculate_total_price(cart_items):
        result = cart_items.values('quantity', 'product__price').aggregate(
            total_price=Sum(F('quantity') * F('product__price'))
        )
        if result["total_price"] is None:
            return 0
        return result["total_price"]

    @staticmethod
    def change_quantity(cart):
        cart_items = CartItem.objects.filter(cart=cart).select_related()
        for item in cart_items:
            item.product.quantity -= item.quantity
            item.product.save()
            logger.info("Quantity of product has been changed.")


class OrderRepository:

    @staticmethod
    def create_order(cart, total_price, address, payment_method):
        new_order = Order.objects.create(
            cart=cart,
            total_price=total_price,
            address=address,
            payment_method=payment_method
        )
        new_order.save()
        logger.info("New order has been created.")
        return new_order


class AddressRepository:

    @staticmethod
    def get_available_addresses():
        addresses = Address.objects.filter(available=True)
        return addresses

    @staticmethod
    def find_address_by_id(address_id):
        address = Address.objects.filter(id=address_id).first()
        return address
