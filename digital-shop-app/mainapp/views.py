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
from mainapp.serializers import ProductSerializer, UserSerializer, CategorySerializer, CartSerializer, CartItemSerializer
from mainapp.pagination import ProductPagination
from mainapp.permissions import IsOwnerOrReadOnly, IsSellerOrReadOnly
from mainapp.services import CartService, CartItemService
import mainapp.consts as consts


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = ProductPagination

    def get_permissions(self):
        safe_actions = [
            'list',
            'retrieve',
            'get_category_products',
            'get_user_products',
            'get_active_products'
        ]
        if self.action in safe_actions:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSellerOrReadOnly, IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Product.objects.all()
        full_queryset_actions = ['retrieve', 'partial_update', 'update', 'destroy']
        if self.action not in full_queryset_actions:
            # We want to display only active items on home and category related pages
            queryset = Product.objects.filter(is_active=True)
        return queryset

    @action(
        methods=['get'],
        detail=False,
        url_path=r'category/(?P<category_verbose>[^/.]+)')
    def get_category_products(self, request, category_verbose):
        category = Category.objects.get(verbose=category_verbose)
        products = self.get_queryset().filter(category=category)
        # Creating pagination
        page = self.paginate_queryset(products)   # Paginating queryset (products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)       # Serializing paginated queryset
            return self.get_paginated_response(serializer.data)     # Returning serialized data
        # Error case
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # Method for getting user related products (used in profile page)
    @action(methods=['get'], detail=False, url_path=r'get_user_products/(?P<user_id>[0-9])')
    def get_user_products(self, request, user_id):
        products = Product.objects.filter(created_by=user_id)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)       # Serializing paginated queryset
            return self.get_paginated_response(serializer.data)     # Returning serialized data
        return Response(status=status.HTTP_400_BAD_REQUEST)


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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        if self.action in ['retrieve']:
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
    pagination_class = ProductPagination

    def get_permissions(self):
        # Allowing partial update to any user can cause security issues
        safe_actions = [
            'add_item_to_cart',
            'get_non_user_cart_items',
            'get_user_cart_items',
            'get_cart_product_ids',
            'remove_item_from_cart',
            'partial_update',
        ]
        if self.action in safe_actions:
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
        # In request.data there should be id of a product and cart id
        response = CartItemService(request).add_execute()
        return response

    @action(
        methods=['post'],
        detail=False,
        url_path='remove_item_from_cart'
    )
    def remove_item_from_cart(self, request):
        # In request.data there should be id of a product and cart id
        response = CartItemService(request).remove_execute()
        return response

    @action(
        methods=['get'],
        detail=False,
        url_path='get_cart_product_ids'
    )
    def get_cart_product_ids(self, request):
        # In request.data there should be id of a product
        cart_id = CartService(request)._get_either_cart_id_from_cookie()
        response = CartItemService(request)._get_ids_execute(cart_id)
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
