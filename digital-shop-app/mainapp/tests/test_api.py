from allauth.account.models import EmailAddress
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from mainapp.models import Product, Category, CustomUser, Cart, CartItem, Order, Address
from mainapp import consts


# Integration tests here

class ProductViewSetTestCase(TestCase):

    def setUp(self):
        # For integration tests it's better to use DRF client
        self.api_client = APIClient()
        # Admin with verified email
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        # Seller with verified email
        self.user = CustomUser.objects.create_user(
            email="test1@gmail.com",
            username="test1",
            password="12345",
            is_seller=True
        )
        # Seller without verified email
        self.user2 = CustomUser.objects.create_user(
            email="test2@gmail.com",
            username="test2",
            password="12345",
            is_seller=True
        )
        # Regular user (not seller or superuser)
        self.user3 = CustomUser.objects.create_user(
            email="test3@gmail.com",
            username="test3",
            password="12345"
        )
        EmailAddress.objects.create(
            user=self.superuser,
            email=self.superuser.email,
            verified=True,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user,
            email=self.user.email,
            verified=True,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user2,
            email=self.user2.email,
            verified=False,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user3,
            email=self.user3.email,
            verified=True,
            primary=True
        )
        self.category = Category.objects.create(
            name="Test category 1",
            slug="test-category-1"
        )
        self.product = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 1",
            price=40.0,
            quantity=20
        )

    def test_permissions(self):
        new_product = {
            "category": self.category.id,
            "created_by": self.user3.id,
            "title": "New product 123",
            "description": "description",
            "price": "123.12",
            "quantity": 23,
            "is_active": True,
        }
        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }

        # Testing AllowAny
        res = self.api_client.get('/api/product/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Testing IsAuthenticated
        res = self.api_client.post('/api/product/', new_product)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        # Testing IsSellerOrReadOnly
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        res = self.api_client.post('/api/product/', new_product)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Changing login credentials
        user_data['username'] = self.user2.email
        new_product['created_by'] = self.user2.id
        # Logout endpoint will work only with content_type = 'application/json'
        self.api_client.post('/api/dj-rest-auth/logout/', data={}, content_type='application/json')
        # Clearing cookies otherwise we won't be able to login
        self.api_client.cookies = {}
        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        # Testing IsVerifiedEmail permission
        res = self.api_client.post('/api/product/', new_product)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Changing login credentials
        user_data['username'] = self.user.email
        self.api_client.post('/api/dj-rest-auth/logout/', data={}, content_type='application/json')
        self.api_client.cookies = {}
        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        # Testing IsCreatorEqualsCurrentUser permission
        # Creating product with different owner (current user != user id in created_by field) => 403
        res = self.api_client.post('/api/product/', new_product)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

        # Testing IsOwnerOrReadOnly permission
        # Product with id = 1 is owned by superuser
        # 404 because of custom get_queryset method
        res = self.api_client.patch('/api/product/1/', data=new_product)
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

        # Successfully creating product with same owner
        new_product['created_by'] = self.user.id
        res = self.api_client.post('/api/product/', new_product)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        # Testing patch (unsafe method, partial_update - unsafe action)
        product_id = Product.objects.filter(title="New product 123").first().id
        new_product['title'] = "Title new 4"
        res = self.api_client.patch(f'/api/product/{product_id}/', data=new_product)
        self.assertEqual(res.status_code, status.HTTP_200_OK)


class UserViewSetTestCase(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        self.user = CustomUser.objects.create_user(
            email="test1@gmail.com",
            username="test1",
            password="12345",
            is_seller=True
        )
        self.user2 = CustomUser.objects.create_user(
            email="test2@gmail.com",
            username="test2",
            password="12345",
            is_seller=True
        )
        self.user3 = CustomUser.objects.create_user(
            email="test3@gmail.com",
            username="test3",
            password="12345"
        )
        EmailAddress.objects.create(
            user=self.superuser,
            email=self.superuser.email,
            verified=True,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user,
            email=self.user.email,
            verified=True,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user2,
            email=self.user2.email,
            verified=False,
            primary=True
        )
        EmailAddress.objects.create(
            user=self.user3,
            email=self.user3.email,
            verified=True,
            primary=True
        )

    def test_get_queryset(self):
        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        self.assertEqual(CustomUser.objects.count(), 4)
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        res = self.api_client.get('/api/user-info/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

    def test_permissions(self):
        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        new_user_data = {
            'username': 'new_username123',
            'is_seller': False,
        }

        # Testing AllowAny
        res = self.api_client.get(f'/api/user-info/{self.superuser.id}/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Testing IsAuthenticated
        res = self.api_client.get('/api/user-info/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        # Testing IsSameUser
        res = self.api_client.patch(f'/api/user-info/{self.user2.id}/', new_user_data)
        # 404 because queryset is limited and you simply can't see any other user if action != 'retrieve'
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update(self):
        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        new_user_data = {
            'username': 'new_username123',
            'email': 'new_email123@gmail.com',
            'is_seller': True,
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        self.assertTrue(EmailAddress.objects.filter(email=self.user3.email).first().verified)
        res = self.api_client.patch(f'/api/user-info/{self.user3.id}/', new_user_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        # Email address should become unverified
        self.assertFalse(EmailAddress.objects.filter(email=res.data["email"]).first().verified)
        # Here we also checked read_only_fields in serializer
        self.assertFalse(CustomUser.objects.filter(id=self.user3.id).first().is_seller)

    def test_get_authenticated_user(self):
        res = self.api_client.get('/api/user-info/get_authenticated_user/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        res = self.api_client.get('/api/user-info/get_authenticated_user/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["id"], self.user3.id)


class CategoryViewSetTestCase(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        self.category = Category.objects.create(
            name="Test category 1",
            slug="test-category-1"
        )

    def test_permissions(self):
        res = self.api_client.get(f'/api/category/{self.category.id}/')
        res2 = self.api_client.get('/api/category/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)

        new_category_data = {'name': 'New test category 2'}

        res = self.api_client.patch(f'/api/category/{self.category.id}/', new_category_data)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        user_data = {
            'username': self.superuser.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        res = self.api_client.patch(f'/api/category/{self.category.id}/', new_category_data)
        self.assertEqual(res.status_code, status.HTTP_200_OK)


class CartViewSetTestCase(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        self.user3 = CustomUser.objects.create_user(
            email="test3@gmail.com",
            username="test3",
            password="12345"
        )
        self.non_user_cart = Cart.objects.create()
        self.user_cart = Cart.objects.create(user=self.user3)
        self.archived_user_cart = Cart.objects.create(user=self.user3, is_archived=True)

    def test_permissions(self):
        # AllowAny
        res = self.api_client.get('/api/cart/get_cart/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(Cart.objects.count(), 4)

        # IsAuthenticated
        res = self.api_client.get('/api/cart/get_user_cart/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        res = self.api_client.get('/api/cart/get_user_cart/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(
            int(self.api_client.cookies[consts.USER_CART_ID_COOKIE_NAME].value),
            self.user_cart.id
        )

        # IsAdminUser
        new_cart_data = {'is_deleted': True}
        res = self.api_client.patch('/api/cart/1/', new_cart_data)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_queryset(self):
        res = self.api_client.get('/api/cart/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 0)

        # Creating non user cart with cookie
        self.api_client.get('/api/cart/get_cart/')

        res = self.api_client.get('/api/cart/')
        self.assertEqual(len(res.data), 1)

        user_data = {
            'username': self.user3.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        # Creating user cart cookie
        self.api_client.get('/api/cart/get_user_cart/')

        res = self.api_client.get('/api/cart/')
        self.assertEqual(len(res.data), 3)

        self.assertEqual(Cart.objects.count(), 4)


class CartItemViewSetTestCase(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        self.user = CustomUser.objects.create_user(
            email="test3@gmail.com",
            username="test3",
            password="12345"
        )
        self.user_cart = Cart.objects.create(user=self.user)
        self.archived_user_cart = Cart.objects.create(user=self.user, is_archived=True)
        self.category = Category.objects.create(
            name="Test category 1",
            slug="test-category-1"
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
            price=52.5,
            quantity=10
        )
        self.user_cart_item = CartItem.objects.create(
            quantity=5,
            cart=self.user_cart,
            product=self.product
        )
        self.ordered_cart_item = CartItem.objects.create(
            quantity=5,
            cart=self.archived_user_cart,
            product=self.product
        )

    def test_permissions(self):
        # AllowAny
        self.api_client.get('/api/cart/get_cart/')
        cart_id = int(self.api_client.cookies[consts.NON_USER_CART_ID_COOKIE_NAME].value)
        new_cart = Cart.objects.filter(id=cart_id).first()
        new_cart_item = CartItem.objects.create(quantity=5, cart=new_cart, product=self.product)
        res = self.api_client.patch(f'/api/cart-item/{new_cart_item.id}/', {"quantity": 2})
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        user_data = {
            'username': self.user.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)

        # IsAdmisUser
        res = self.api_client.post('/api/cart-item/', {"quantity": 7})
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_queryset(self):
        res = self.api_client.get('/api/cart-item/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 0)

        # Creating non user cart with cookie
        self.api_client.get('/api/cart/get_cart/')
        cart_id = int(self.api_client.cookies[consts.NON_USER_CART_ID_COOKIE_NAME].value)
        new_cart = Cart.objects.filter(id=cart_id).first()
        CartItem.objects.create(quantity=5, cart=new_cart, product=self.product)

        res = self.api_client.get('/api/cart-item/')
        self.assertEqual(len(res.data["results"]), 1)

        user_data = {
            'username': self.user.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        # Creating user cart cookie
        self.api_client.get('/api/cart/get_user_cart/')
        new_cart = Cart.objects.filter(id=int(self.api_client.cookies[consts.USER_CART_ID_COOKIE_NAME].value)).first()
        CartItem.objects.create(quantity=2, cart=new_cart, product=self.product2)

        cart1 = Cart.objects.create()
        CartItem.objects.create(quantity=1, cart=cart1, product=self.product2)

        res = self.api_client.get('/api/cart-item/')
        self.assertEqual(len(res.data["results"]), 4)
        self.assertEqual(CartItem.objects.count(), 5)


class OrderViewSetTestCase(TestCase):

    def setUp(self):
        self.api_client = APIClient()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="12345",
            is_seller=True
        )
        self.user = CustomUser.objects.create_user(
            email="test3@gmail.com",
            username="test3",
            password="12345"
        )
        self.user_cart = Cart.objects.create(user=self.user)
        self.non_user_cart = Cart.objects.create()
        self.address = Address.objects.create(name="Norway", available=True)
        self.order1 = Order.objects.create(cart=self.user_cart, address=self.address, total_price=0)
        self.order2 = Order.objects.create(cart=self.non_user_cart, address=self.address, total_price=0)

    def test_get_queryset(self):
        self.assertEqual(Order.objects.count(), 2)

        res = self.api_client.get('/api/order/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

        user_data = {
            'username': self.user.email,
            'password': '12345',
        }
        self.api_client.post('/api/dj-rest-auth/login/', user_data)
        res = self.api_client.get('/api/order/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 1)
        self.assertEqual(Order.objects.count(), 2)
