from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse

from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.renderers import TemplateHTMLRenderer
from rest_framework import status

from mainapp.models import Product, Category, CustomUser
from mainapp.serializers import ProductSerializer, UserSerializer, CategorySerializer


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (AllowAny, )

    # Depending on url this must return either all products or just user's ones
    def get_queryset(self):
        queryset = Product.objects.all()
        return queryset

    # Method for getting user related products (used in profile page)
    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def get_user_products(self, request):
        products = Product.objects.filter(created_by=self.request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        queryset = Category.objects.all()
        return queryset
    
    @action(
        methods=['get'],
        detail=False,
        url_path=r'(?P<category_verbose>[^/.]+)')
    def get_category_products(self, request, category_verbose):
        # Add check is_valid() or smth, need to return 404 in case of an error
        category = Category.objects.get(verbose=category_verbose)
        products = Product.objects.filter(category=category)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = CustomUser.objects.filter(pk=self.request.user.pk)
        return queryset
