from allauth.account.models import EmailAddress
from django.conf import settings
from rest_framework import serializers
from dj_rest_auth.serializers import PasswordResetSerializer, PasswordResetConfirmSerializer
# Imports for custom password reset serializers
from rest_framework.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode as uid_decoder
from django.contrib.auth.forms import PasswordResetForm
from django.contrib.auth.tokens import default_token_generator

from mainapp.models import Product, CustomUser, Category, Cart, CartItem, Order, Address


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        # fields = '__all__'
        # fields = ('id', 'email', 'username', 'photo')
        exclude = ('password', 'user_permissions', 'groups')
        read_only_fields = ('is_seller', )


class ProductSerializer(serializers.ModelSerializer):
    # Additional fields (need them to display foreign key extra data (by default only id is returned))
    # See userProfile.js for reference
    category_name = serializers.StringRelatedField(source='category', read_only=True)
    creator_name = serializers.StringRelatedField(source='created_by', read_only=True)

    class Meta:
        model = Product
        # fields = '__all__'
        # All fields were declared explicitly because in_stock is a function with @property decorator
        fields = (
            'id',
            'category',
            'category_name',
            'created_by',
            'creator_name',
            'title',
            'description',
            'price',
            'quantity',
            'image',
            'is_active',
            'in_stock',
            'published',
            'updated',
        )


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        # fields = ('id', 'name')


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    cart = CartSerializer()
    product = ProductSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'total_price', ]


class OrderSerializer(serializers.ModelSerializer):
    cart = CartSerializer()

    class Meta:
        model = Order
        fields = '__all__'


class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = '__all__'


class EmailAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmailAddress
        fields = '__all__'


# Customized because original one doesn't work properly
class CustomPasswordResetSerializer(PasswordResetSerializer):
    # Deleted a few lines that weren't working as intended
    def save(self):
        request = self.context.get('request')
        # Set some values to trigger the send_email method.
        opts = {
            'use_https': request.is_secure(),
            'from_email': getattr(settings, 'DEFAULT_FROM_EMAIL'),
            'request': request,
            'token_generator': default_token_generator,
        }

        opts.update(self.get_email_options())
        self.reset_form.save(**opts)

    # Deleted a few lines that weren't working as intended
    def validate_email(self, value):
        # Create PasswordResetForm with the serializer
        self.reset_form = PasswordResetForm(data=self.initial_data)
        if not self.reset_form.is_valid():
            raise serializers.ValidationError(self.reset_form.errors)

    # Customizing email messages that are sent to user's email
    def get_email_options(self):
        return {
            'subject_template_name': 'messages/password_reset_subject.txt',
            'email_template_name': 'messages/password_reset_message.txt',
            'html_email_template_name': 'messages/password_reset_message.html',
        }


# Get the UserModel
UserModel = get_user_model()


# Customized because original one doesn't work properly
class CustomPasswordResetConfirmSerializer(PasswordResetConfirmSerializer):
    # Deleted a few lines that weren't working as intended
    def validate(self, attrs):
        # Decode the uidb64 (allauth use base36) to uid to get User object
        try:
            uid = force_str(uid_decoder(attrs['uid']))
            self.user = UserModel._default_manager.get(pk=uid)
        except (TypeError, ValueError, OverflowError, UserModel.DoesNotExist):
            raise ValidationError({'uid': ['Invalid value']})

        if not default_token_generator.check_token(self.user, attrs['token']):
            raise ValidationError({'token': ['Invalid value']})

        self.custom_validation(attrs)
        # Construct SetPasswordForm instance
        self.set_password_form = self.set_password_form_class(
            user=self.user, data=attrs,
        )
        if not self.set_password_form.is_valid():
            raise serializers.ValidationError(self.set_password_form.errors)

        return attrs
