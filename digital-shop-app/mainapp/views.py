import requests
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


def app(request, *args, **kwargs):
    return render(request, 'mainapp/app.html')


class ProductViewSet(ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes = (IsAuthenticated, )

    # Depending on url this must return either all products or just user's ones
    def get_queryset(self):
        #queryset = Product.objects.filter(created_by=self.request.user)
        queryset = Product.objects.all()
        return queryset


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = (AllowAny, )

    def get_queryset(self):
        queryset = Category.objects.all()
        return queryset


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = CustomUser.objects.filter(pk=self.request.user.pk)
        return queryset

    # Method for getting user related products (used in profile page)
    @action(methods=['get'], detail=False, permission_classes=[IsAuthenticated])
    def get_user_products(self, request):
        products = Product.objects.filter(created_by=self.request.user)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



# 200 - OK, 401 - No token or token not valid
class VerifyTokens(APIView):
    # We want this to be available for anonymous users
    permission_classes = (AllowAny, )

    def get(self, request):
        # TODO: replace with settings variable
        refresh_token = request.COOKIES.get('digital-shop-refresh-token')
        #access_token = request.COOKIES.get('digital-shop-auth')

        if refresh_token is None:
            error_msg = { 'detail': 'Refresh token not found.' }
            return Response(error_msg, status=status.HTTP_401_UNAUTHORIZED)

        # Post request data (to verify token)
        post_data = {
            'token': refresh_token,
        }

        verify_url = request.build_absolute_uri('/api/dj-rest-auth/token/verify/')
        verify_request = requests.post(verify_url, post_data)

        if verify_request.status_code == status.HTTP_200_OK:
            return Response(status=status.HTTP_200_OK)
        if verify_request.status_code == status.HTTP_401_UNAUTHORIZED:
            return Response(verify_request.json(), status=status.HTTP_401_UNAUTHORIZED)
