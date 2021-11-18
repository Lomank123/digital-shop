from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework import generics
from rest_framework.response import Response

from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import TemplateHTMLRenderer

from mainapp.models import CustomEntity
from django.contrib.auth.models import User

from mainapp.serializers import EntitySerializer, UserSerializer


class CustomTemplateView(TemplateView):
    template_name = 'mainapp/home.html'
	#authentication_classes = [TokenAuthentication]
	#permission_classes = [IsAuthenticated]
    #queryset = CustomEntity.objects.all()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["entities"] = CustomEntity.objects.all()
        return context


class UserDetail(generics.RetrieveAPIView):
    """
    A view that returns a templated HTML representation of a given user.
    """
    queryset = User.objects.all()
    renderer_classes = [TemplateHTMLRenderer]
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]


    def get(self, request, *args, **kwargs):
        self.object = self.get_object()
        return Response({'user123': self.object}, template_name="mainapp/home.html")


class EntityViewSet(ModelViewSet):
    serializer_class = EntitySerializer
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        queryset = CustomEntity.objects.filter(user=self.request.user)
        #queryset = CustomEntity.objects.all()
        return queryset


class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, )
