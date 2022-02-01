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
from mainapp.services import CartService


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )
    parser_classes = [MultiPartParser, FormParser]
    pagination_class = ProductPagination

    def get_permissions(self):
        safe_actions = ['list', 'retrieve', 'get_category_products', 'get_user_products']
        if self.action in safe_actions:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsSellerOrReadOnly, IsOwnerOrReadOnly]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Product.objects.all()
        return queryset

    @action(
        methods=['get'],
        detail=False,
        url_path=r'category/(?P<category_verbose>[^/.]+)')
    def get_category_products(self, request, category_verbose):
        category = Category.objects.get(verbose=category_verbose)
        products = Product.objects.filter(category=category)
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
        if self.action in ['list', 'get_user_cart']:
            permission_classes = [IsAuthenticated]
        elif self.action in ['retrieve', 'delete_user_cart_id_cookie']:
            # AllowAny because we'll need to retrieve user data in product detail page
            # And as for get_user_products, for example, when accessing another user's page we want to see their products
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

    def update(self, request, *args, **kwargs):
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
            print("Email changed")
            address = EmailAddress.objects.filter(user=self.request.user).get()
            address.change(request, new_email)  # This does all the magic (sends email message and change EmailAdress instance)
            print("Confirmation message sent")
        else:
            print("Email is the same")
        # Performing update of user instance
        return super().update(request, *args, **kwargs)

    # Used on user log in
    @action(
        methods=['get'],
        detail=False,
        url_path='get_user_cart'
    )
    def get_user_cart(self, request):
        response = Response(status=status.HTTP_200_OK)
        cart_obj = Cart.objects.filter(user=self.request.user, is_deleted=False).first()
        # Perhaps this code should be moved to separate service (UserCartService)
        # Here we set anonymous cart as a new user cart if logged in user doesn't have one
        if not cart_obj:
            anon_cart_id = self.request.COOKIES["cart_id"]
            anon_cart = Cart.objects.filter(id=anon_cart_id).first()
            print("Anonymous cart becomes user cart: ", anon_cart)
            if anon_cart.user:
                print("Anon cart already has user!!")
                new_cart = Cart.objects.create()
                anon_cart = new_cart
                expires = datetime.datetime.now() + datetime.timedelta(days=30)
                response.set_cookie('cart_id', anon_cart.id, expires=expires, httponly=True, samesite='Lax')
                print("Created another cart for this user!")
            cart_obj = anon_cart
            cart_obj.user = self.request.user
            cart_obj.save()
            # Deleting cart_id cookie after attaching cart
            response.delete_cookie('cart_id', samesite='Lax')
        else:
            print("User already has cart!")

        # Setting user_cart_id cookie only if it doesn't exist at the moment
        if self.request.COOKIES.get('user_cart_id', None) is None:
            print("user_cart_id cookie set!")
            expires = datetime.datetime.now() + datetime.timedelta(days=30)
            response.set_cookie('user_cart_id', cart_obj.id, expires=expires, httponly=True, samesite='Lax')
        else:
            print("user_cart_id cookie already exists!")

        return response

    # Used on log out
    @action(
        methods=['post'],
        detail=False,
        url_path='delete_user_cart_id_cookie'
    )
    def delete_user_cart_id_cookie(self, request):
        response = Response(data={"detail": "Cookie successfully deleted."} ,status=status.HTTP_200_OK)
        user_cart_id = self.request.COOKIES.get('user_cart_id', None)
        if user_cart_id:
            response.delete_cookie('user_cart_id', samesite='Lax')
            return response
        return Response(data={"detail": "This cookie doesn't exist"}, status=status.HTTP_400_BAD_REQUEST)


class CartViewSet(ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = (IsAuthenticated, )

    def get_permissions(self):
        safe_actions = ['list', 'retrieve', 'get_cart']
        if self.action in safe_actions:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = Cart.objects.all()
        return queryset

    @action(
        methods=['get'],
        detail=False,
        url_path='get_cart'
    )
    def get_cart(self, request):
        cart_response = CartService(request).execute()
        return cart_response


class CartItemViewSet(ModelViewSet):
    serializer_class = CartItemSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = CartItem.objects.all()
        return queryset


