from rest_framework import serializers

from mainapp.models import CustomEntity
from django.contrib.auth.models import User


class EntitySerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomEntity
        fields = ('user', 'description')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username')
