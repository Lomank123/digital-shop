from allauth.account.models import EmailAddress
from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser

from mainapp.models import CustomUser, Product, Category
from mainapp import permissions


class CustomPermissionsTestCase(TestCase):

    def setUp(self):
        self.superuser = CustomUser.objects.create_superuser(
            email='admin@gmail.com',
            username='admin',
            password='12345'
        )
        self.user = CustomUser.objects.create_user(
            email='test1@gmail.com',
            username='test1',
            password='12345'
        )
        EmailAddress.objects.create(
            user=self.superuser,
            email=self.superuser.email,
            verified=True,
            primary=True
        )
        # self.cart = Cart.objects.create(user=self.user)
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

    def test_is_verified_email_permission(self):
        # 3 cases
        # Here we're using post method just because it is unsafe (not in SAFE_METHODS)
        request = RequestFactory().post('/')
        request.user = self.superuser
        self.assertTrue(permissions.IsVerifiedEmail().has_permission(request=request, view=None))
        request.user = self.user
        self.assertFalse(permissions.IsVerifiedEmail().has_permission(request=request, view=None))
        # This case will return True because simple request is in SAFE_METHODS (check mainapp.permissions)
        request = RequestFactory().request()
        self.assertTrue(permissions.IsVerifiedEmail().has_permission(request=request, view=None))

    def test_is_same_user(self):
        request = RequestFactory().post('/')
        request.user = self.superuser
        self.assertTrue(permissions.IsSameUser().has_object_permission(
            request=request,
            view=None,
            obj=self.superuser
        ))
        request.user = self.user
        self.assertTrue(permissions.IsSameUser().has_object_permission(
            request=request,
            view=None,
            obj=self.user
        ))
        anon_user = AnonymousUser()
        request.user = anon_user
        self.assertFalse(permissions.IsSameUser().has_object_permission(
            request=request,
            view=None,
            obj=self.user
        ))
        request = RequestFactory().request()
        self.assertTrue(permissions.IsSameUser().has_object_permission(
            request=request,
            view=None,
            obj=self.user
        ))

    def test_is_owner_or_ro(self):
        request = RequestFactory().post('/')
        request.user = self.superuser
        self.assertTrue(permissions.IsOwnerOrReadOnly().has_object_permission(
            request=request,
            view=None,
            obj=self.product
        ))
        request.user = self.user
        self.assertFalse(permissions.IsOwnerOrReadOnly().has_object_permission(
            request=request,
            view=None,
            obj=self.product
        ))
        request = RequestFactory().request()
        self.assertTrue(permissions.IsOwnerOrReadOnly().has_object_permission(
            request=request,
            view=None,
            obj=self.product
        ))

    def test_is_seller_or_ro(self):
        request = RequestFactory().post('/')
        request.user = self.superuser
        self.assertTrue(permissions.IsSellerOrReadOnly().has_permission(request=request, view=None))
        request.user = self.user
        self.assertFalse(permissions.IsSellerOrReadOnly().has_permission(request=request, view=None))
        request = RequestFactory().request()
        self.assertTrue(permissions.IsSellerOrReadOnly().has_permission(request=request, view=None))
