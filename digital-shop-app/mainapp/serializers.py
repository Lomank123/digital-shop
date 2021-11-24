from rest_framework import serializers
from rest_auth.serializers import PasswordResetSerializer

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


# To customize email message (need to provide another link instead of default)
class CustomPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        return {
            'subject_template_name': 'messages/password_reset_subject.txt',
            'email_template_name': 'messages/password_reset_message.txt',
            'html_email_template_name': 'messages/password_reset_message.html',
        }