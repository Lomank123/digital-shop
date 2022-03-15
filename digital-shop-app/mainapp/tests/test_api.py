import json
from django.test import TestCase, RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIRequestFactory

from mainapp import consts
from mainapp.models import Product, Category, CustomUser, Cart, CartItem, Order
from mainapp.services import CartService, CartItemService


class CartAPITestCase(TestCase):

    # Initial data
    def setUp(self) -> None:
        self.user = CustomUser.objects.create_user(email="test1@gmail.com", username="test1", password="1234")
        superuser = CustomUser.objects.create_superuser(email="super1@gmail.com", username="super1", password="123")
        category = Category.objects.create(name="Test category 1", verbose="test-category-1")
        product1 = Product.objects.create(category=category, created_by=superuser, title="Test title 1", price=40.0, quantity=2)
        product2 = Product.objects.create(category=category, created_by=superuser, title="Test title 2", price=120.0, quantity=0)

    def test_get_cart(self):
        self.assertEqual(Cart.objects.count(), 0)
        request = RequestFactory().get('/')
        res = CartService(request).either_cart_execute()
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Cart.objects.count(), 1)
    
    def test_get_user_cart(self):
        self.assertEqual(Cart.objects.count(), 0)
        cart = Cart.objects.create()
        request = RequestFactory().get('/')
        request.user = self.user
        request.COOKIES = {
            consts.NON_USER_CART_ID_COOKIE_NAME: cart.id,
        }
        res = CartService(request).user_cart_execute()
        self.assertEqual(res.status_code, 200)
        user_cart = Cart.objects.filter(user=self.user)
        self.assertEqual(user_cart.count(), 1)
        self.assertEqual(Cart.objects.count(), 1)

    def test_delete_user_cart_id_cookie(self):
        self.assertEqual(Cart.objects.count(), 0)
        cart = Cart.objects.create(user=self.user)
        request = RequestFactory().get('/')
        request.user = self.user
        request.COOKIES = {
            consts.USER_CART_ID_COOKIE_NAME: cart.id,
        }
        res = CartService(request).user_cart_id_delete_execute()
        self.assertEqual(res.status_code, 200)
        #print(res.cookies.items())
