from allauth.account.models import EmailAddress
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from mainapp.models import Product, Category, CustomUser, Cart, CartItem, Order


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
            verbose="test-category-1"
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
        res = self.api_client.get('/api/product/', new_product)
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
        res = self.api_client.patch('/api/product/1/', data=new_product)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

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
        # Insert data to test permissions
        pass

    def test_permissions(self):
        pass


class CategoryViewSetTestCase(TestCase):

    def setUp(self):
        # Insert data to test permissions
        pass

    def test_permissions(self):
        pass


class CartViewSetTestCase(TestCase):

    def setUp(self):
        # Insert data to test permissions
        pass

    def test_permissions(self):
        pass


class CartItemViewSetTestCase(TestCase):

    def setUp(self):
        # Insert data to test permissions
        pass

    def test_permissions(self):
        pass


class OrderViewSetTestCase(TestCase):

    def setUp(self):
        # Insert data to test permissions
        pass

    def test_permissions(self):
        pass
