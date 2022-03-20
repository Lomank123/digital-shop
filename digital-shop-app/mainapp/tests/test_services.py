from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser
from rest_framework import status
from rest_framework.request import Request

from mainapp import consts
from mainapp.models import Product, Category, CustomUser, Cart, CartItem, Order
from mainapp.services import CartService, CartItemService
from mainapp.views import CartItemViewSet


class CartServiceTestCase(TestCase):

    # Initial data
    def setUp(self) -> None:
        self.user = CustomUser.objects.create_user(
            email="test1@gmail.com",
            username="test1",
            password="1234"
        )

    def test_either_cart_execute(self):
        self.assertEqual(Cart.objects.count(), 0)
        request = RequestFactory().request()
        res = CartService(request).either_cart_execute()
        cart_cookie = res.cookies[consts.NON_USER_CART_ID_COOKIE_NAME]
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Cart.objects.count(), 1)
        self.assertTrue(cart_cookie)
        # Second check to ensure we're not creating the second cart
        request.COOKIES = {
            consts.NON_USER_CART_ID_COOKIE_NAME: cart_cookie.value,
        }
        res2 = CartService(request).either_cart_execute()
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(Cart.objects.count(), 1)
        cart_id = Cart.objects.first().id
        self.assertEqual(cart_id, int(cart_cookie.value))

    def test_user_cart_execute(self):
        cart = Cart.objects.create()
        request = RequestFactory().request()
        request.user = self.user
        request.COOKIES = {
            consts.NON_USER_CART_ID_COOKIE_NAME: cart.id,
        }
        res = CartService(request).user_cart_execute()
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.cookies[consts.USER_CART_ID_COOKIE_NAME])
        self.assertEqual(Cart.objects.filter(user=self.user).count(), 1)
        self.assertEqual(res.data[consts.DETAIL_KEY], consts.NEW_CART_ATTACHED)
        # Second check when user already has attached cart
        res2 = CartService(request).user_cart_execute()
        self.assertEqual(res2.status_code, 200)
        self.assertTrue(res2.cookies[consts.USER_CART_ID_COOKIE_NAME])
        self.assertEqual(res2.data[consts.DETAIL_KEY], consts.CHECK_CART_ON_LOGIN_SUCCESS)

    def test_user_cart_id_delete_execute(self):
        cart = Cart.objects.create(user=self.user)
        request = RequestFactory().request()
        request.COOKIES = {
            consts.USER_CART_ID_COOKIE_NAME: cart.id,
        }
        res = CartService(request).user_cart_id_delete_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.cookies[consts.USER_CART_ID_COOKIE_NAME].value), 0)


class CartItemServiceTestCase(TestCase):

    # Initial data
    def setUp(self) -> None:
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="123"
        )
        self.user = CustomUser.objects.create_user(
            email="test1@gmail.com",
            username="test1",
            password="1234"
        )
        self.cart = Cart.objects.create(user=self.user)
        self.category = Category.objects.create(
            name="Test category 1",
            verbose="test-category-1"
        )
        self.product = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 1",
            price=40.0,
            quantity=20
        )
        self.product2 = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 2",
            price=120.0,
            quantity=40
        )
        self.cart_item1 = CartItem.objects.create(
            quantity=1,
            cart=self.cart,
            product=self.product
        )
        self.cart_item2 = CartItem.objects.create(
            quantity=3,
            cart=self.cart,
            product=self.product2
        )

    def test_add_execute(self):
        self.assertEqual(CartItem.objects.count(), 2)
        new_product = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 3",
            price=20.4,
            quantity=6
        )
        request = RequestFactory().request()
        request.data = {
            consts.PRODUCT_ID_POST_KEY: new_product.id,
            consts.CART_ID_POST_KEY: self.cart.id,
        }
        res = CartItemService(request).add_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(CartItem.objects.filter(cart=self.cart).count(), 3)
        # Trying to add existing product to cart (should fail)
        request.data = {
            consts.PRODUCT_ID_POST_KEY: self.product2.id,
            consts.CART_ID_POST_KEY: self.cart.id,
        }
        res2 = CartItemService(request).add_execute()
        self.assertEqual(res2.status_code, 400)
        self.assertEqual(res2.data[consts.DETAIL_KEY], consts.CART_ITEM_ADD_ERROR_MSG)

    def test_remove_execute(self):
        self.assertEqual(CartItem.objects.count(), 2)
        request = RequestFactory().request()
        request.data = {
            consts.PRODUCT_ID_POST_KEY: self.product.id,
            consts.CART_ID_POST_KEY: self.cart.id,
        }
        res = CartItemService(request).remove_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(CartItem.objects.filter(cart=self.cart).count(), 1)
        # Expecting None type
        self.assertFalse(CartItem.objects.filter(id=self.cart_item1.id).first())

    def test_remove_all_execute(self):
        self.assertEqual(CartItem.objects.count(), 2)
        request = RequestFactory().request()
        request.data = {
            consts.CART_ID_POST_KEY: self.cart.id,
        }
        res = CartItemService(request).remove_all_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(CartItem.objects.filter(cart=self.cart).count(), 0)

    def test_get_execute(self):
        # Without covering factory request with DRF's Request there'll be an error in viewset
        request = Request(RequestFactory().request())
        viewset = CartItemViewSet(request=request, format_kwarg=None)
        res = CartItemService(request).get_execute(self.cart.id, viewset_instance=viewset)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["results"]), 2)
        self.assertEqual(res.data["results"][1]["id"], self.cart_item1.id)
        self.assertEqual(res.data["results"][0]["id"], self.cart_item2.id)

    def test_get_ids_execute(self):
        request = RequestFactory().request()
        res = CartItemService(request).get_ids_execute(self.cart.id)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.data["data"]), 2)
        self.assertTrue(self.product.id in res.data["data"])
        self.assertTrue(self.product2.id in res.data["data"])

    def test_delete_by_product_execute(self):
        self.assertEqual(CartItem.objects.count(), 2)
        request = RequestFactory().request()
        request.data = {
            consts.PRODUCT_ID_POST_KEY: self.product.id,
        }
        res = CartItemService(request).delete_by_product_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(CartItem.objects.count(), 1)
        self.assertFalse(CartItem.objects.filter(id=self.cart_item1.id).first())

    def test_change_items_owner_execute(self):
        # Preparations
        non_user_cart = Cart.objects.create()
        new_product = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 3",
            price=20.4,
            quantity=6
        )
        new_cart_item = CartItem.objects.create(quantity=3, cart=non_user_cart, product=new_product)
        new_cart_item2 = CartItem.objects.create(quantity=1, cart=non_user_cart, product=self.product)
        self.assertEqual(Product.objects.count(), 3)
        self.assertEqual(Cart.objects.count(), 2)
        self.assertEqual(CartItem.objects.count(), 4)
        # Making request
        request = RequestFactory().request()
        request.COOKIES = {
            consts.NON_USER_CART_ID_COOKIE_NAME: non_user_cart.id,
            consts.USER_CART_ID_COOKIE_NAME: self.cart.id,
        }
        res = CartItemService(request).change_items_owner_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Cart.objects.count(), 2)
        item = CartItem.objects.filter(id=new_cart_item.id).first()
        self.assertEqual(item.cart.id, self.cart.id)
        item = CartItem.objects.filter(id=new_cart_item2.id).first()
        self.assertEqual(item.cart.id, non_user_cart.id)
        self.assertEqual(CartItem.objects.filter(cart=self.cart).count(), 3)

    def test_calculate_total_price_execute(self):
        request = RequestFactory().request()
        request.data = {
            consts.CART_ID_POST_KEY: self.cart.id,
        }
        res = CartItemService(request).calculate_total_price_execute()
        expected_total_price = 400
        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data[consts.TOTAL_PRICE_POST_KEY], expected_total_price)

        new_cart = Cart.objects.create()
        request.data = {
            consts.CART_ID_POST_KEY: new_cart.id,
        }
        res2 = CartItemService(request).calculate_total_price_execute()
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(res2.data[consts.TOTAL_PRICE_POST_KEY], 0)

    def test_post_purchase_execute(self):
        # No need to test with both carts as user one will be used in this case
        total_price = 400
        # 1st case: with only user cart
        request = RequestFactory().request()
        request.user = self.user
        request.data = {
            consts.CART_ID_POST_KEY: self.cart.id,
            consts.TOTAL_PRICE_POST_KEY: total_price,
        }
        request.COOKIES = {
            consts.USER_CART_ID_COOKIE_NAME: self.cart.id,
        }
        res = CartItemService(request).post_purchase_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Cart.objects.count(), 2)
        self.assertEqual(Product.objects.filter(id=self.product.id).first().quantity, 19)
        self.assertEqual(Product.objects.filter(id=self.product2.id).first().quantity, 37)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Order.objects.first().total_price, 400)
        self.assertEqual(
            res.cookies[consts.USER_CART_ID_COOKIE_NAME].value,
            str(Cart.objects.filter(is_archived=False, user=self.user).first().id)
        )
        self.assertTrue(Cart.objects.filter(id=self.cart.id).first().is_archived)

        # 2nd case: with only non-user cart
        total_price = 40
        new_cart = Cart.objects.create()
        CartItem.objects.create(quantity=1, cart=new_cart, product=self.product)
        anon_user = AnonymousUser()
        request.user = anon_user
        request.data = {
            consts.CART_ID_POST_KEY: new_cart.id,
            consts.TOTAL_PRICE_POST_KEY: total_price,
        }
        request.COOKIES = {
            consts.NON_USER_CART_ID_COOKIE_NAME: new_cart.id,
        }
        res2 = CartItemService(request).post_purchase_execute()
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(Cart.objects.count(), 4)
        self.assertEqual(Order.objects.count(), 1)
        self.assertEqual(Product.objects.filter(id=self.product.id).first().quantity, 18)
        self.assertEqual(
            res2.cookies[consts.NON_USER_CART_ID_COOKIE_NAME].value,
            str(Cart.objects.filter(is_archived=False, user=None).first().id)
        )
        self.assertTrue(Cart.objects.filter(id=new_cart.id).first().is_archived)
