import datetime
from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from collections import OrderedDict
from allauth.account.models import EmailAddress

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from mainapp.models import Product, Category, CustomUser, Cart, CartItem
from mainapp.serializers import ProductSerializer, UserSerializer, CategorySerializer, CartSerializer, CartItemSerializer, EmailAddressSerializer
from mainapp.pagination import ProductPagination, CartItemPagination
from mainapp.permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly, IsSameUser, IsVerifiedEmail
from mainapp.services import CartService, CartItemService, ProductService
import mainapp.consts as consts


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = ProductPagination

    def get_permissions(self):
        unsafe_actions = [
            'destroy',
            'update',
            'partial_update',
            'create',
        ]
        if self.action in unsafe_actions:
            print("YES")
            permission_classes = [IsVerifiedEmail, IsSellerOrReadOnly, IsOwnerOrReadOnly]
        else:
            permission_classes = [AllowAny,]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Product.objects.all()
        full_queryset_actions = [
            'retrieve',
            'partial_update',
            'update',
            'destroy',
        ]
        if self.action not in full_queryset_actions:
            # We want to display only active items on home and category related pages
            queryset = Product.objects.filter(is_active=True)
        return queryset

    @action(
        methods=['get'],
        detail=False,
        url_path=r'category/(?P<category_verbose>[^/.]+)'
    )
    def get_category_products(self, request, category_verbose):
        response = ProductService(request)._get_category_products_execute(category_verbose, self)
        return response
    
    # Method for getting user related products (used in profile page)
    @action(
        methods=['get'],
        detail=False,
        url_path=r'get_user_products/(?P<user_id>[0-9])'
    )
    def get_user_products(self, request, user_id):
        response = ProductService(request)._get_user_products_execute(user_id, self)
        return response


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        queryset = Category.objects.all()
        return queryset
    
    def get_permissions(self):
        safe_actions = ['list', 'retrieve']
        if self.action in safe_actions:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get_permissions(self):
        if self.action in ['list']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['retrieve']:
            # AllowAny because we'll need to retrieve user data in product detail page
            permission_classes = [AllowAny]
        elif self.action in ['destroy', 'update', 'partial_update']:
            permission_classes = [IsAuthenticated, IsSameUser]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action in ['retrieve'] or self.request.user.is_superuser:
            queryset = CustomUser.objects.all()
        else:
            queryset = CustomUser.objects.filter(pk=self.request.user.pk)
        return queryset

    def partial_update(self, request, *args, **kwargs):
        # We need to change EmailAdress model instance before updating user instance
        # So here we serialize data first
        # Here we passing self.get_object(), because we need our existing object that is going to be changed
        # Without it there'll be an error upon checking is_valid(), obj with this username already exists
        serializer = self.get_serializer(self.get_object(), data=request.data)
        serializer.is_valid(raise_exception=True)
        # Then get new email from validated data
        new_email = serializer.validated_data['email']
        # Checking if new email equals to old one
        if self.request.user.email != new_email:
            # If not, changing email address and sending confirmation message to new email
            address = EmailAddress.objects.filter(user=self.request.user).get()
            address.change(request, new_email)  # This does all the magic (sends email message and change EmailAdress instance)
            print("Confirmation message sent")
        # Performing update of user instance
        return super().partial_update(request, *args, **kwargs)

    @action(
        methods=['get'],
        detail=False,
        url_path='get_authenticated_user'
    )
    def get_authenticated_user(self, request):
        data = UserSerializer(request.user).data
        return Response(data=data, status=status.HTTP_200_OK)


class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated, )

    def get_permissions(self):
        safe_actions = ['list', 'retrieve', 'get_cart', 'delete_user_cart_id_cookie']
        if self.action in safe_actions:
            permission_classes = [AllowAny]
        elif self.action in ['get_user_cart']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Cart.objects.all()
        return queryset

    # Used in the header when open website
    @action(
        methods=['get'],
        detail=False,
        url_path='get_cart'
    )
    def get_cart(self, request):
        cart_response = CartService(request).either_cart_execute()
        return cart_response

    # Used on user log in
    @action(
        methods=['get'],
        detail=False,
        url_path='get_user_cart'
    )
    def get_user_cart(self, request):
        response = CartService(request).user_cart_execute()
        return response

    # Used on log out
    @action(
        methods=['post'],
        detail=False,
        url_path='delete_user_cart_id_cookie'
    )
    def delete_user_cart_id_cookie(self, request):
        response = CartService(request).user_cart_id_delete_execute()
        return response


class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = CartItemPagination

    def get_permissions(self):
        unsafe_actions = [
            'update',
            'create',
            'destroy',
            'list',
            'retrieve'
        ]
        # Allowing partial update to any user can cause security issues
        # TODO: Add permission like isOwner
        if self.action not in unsafe_actions:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = CartItem.objects.all()
        return queryset

    @action(
        methods=['post'],
        detail=False,
        url_path='add_item_to_cart'
    )
    def add_item_to_cart(self, request):
        response = CartItemService(request).add_execute()
        return response

    @action(
        methods=['post'],
        detail=False,
        url_path='remove_item_from_cart'
    )
    def remove_item_from_cart(self, request):
        response = CartItemService(request).remove_execute()
        return response
    
    @action(
        methods=['post'],
        detail=False,
        url_path='remove_all_from_cart'
    )
    def remove_all_from_cart(self, request):
        response = CartItemService(request).remove_all_execute()
        return response

    @action(
        methods=['get'],
        detail=False,
        url_path='get_cart_product_ids'
    )
    def get_cart_product_ids(self, request):
        cart_id = CartService(request)._get_either_cart_id_from_cookie()
        response = CartItemService(request)._get_ids_execute(cart_id)
        return response

    @action(
        methods=['post'],
        detail=False,
        url_path='delete_inactive'
    )
    def delete_inactive(self, request):
        # In request.data there should be id of a product
        response = CartItemService(request)._delete_inactive_execute()
        return response

    @action(
        methods=['get'],
        detail=False,
        url_path='get_non_user_cart_items'
    )
    def get_non_user_cart_items(self, request):
        non_user_cart_id = CartService(request)._get_non_user_cart_id_from_cookie()
        response = CartItemService(request).get_execute(non_user_cart_id, self)
        return response

    @action(
        methods=['get'],
        detail=False,
        url_path='get_user_cart_items'
    )
    def get_user_cart_items(self, request):
        user_cart_id = CartService(request)._get_user_cart_id_from_cookie()
        response = CartItemService(request).get_execute(user_cart_id, self)
        return response

    @action(
        methods=['get'],
        detail=False,
        url_path='move_to_user_cart'
    )
    def move_to_user_cart(self, request):
        response = CartItemService(request)._change_items_owner_execute()
        return response


class EmailAddressViewSet(ModelViewSet):
    serializer_class = EmailAddressSerializer
    permission_classes = (IsAuthenticated, )

    def get_permissions(self):
        safe_actions = [
            'get_email_verified',
        ]
        if self.action in safe_actions:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(
        methods=['get'],
        detail=False,
        url_path='get_email_verified'
    )
    def get_email_verified(self, request):
        email = EmailAddress.objects.filter(user=request.user).first()
        response = Response(status=status.HTTP_200_OK)
        if email is not None:
            serializer = EmailAddressSerializer(email)
            response.data = serializer.data
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
        return response
