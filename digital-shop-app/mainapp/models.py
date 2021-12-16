from django.db import models
from django.core import validators
from django.contrib.auth.models import AbstractUser
from easy_thumbnails.fields import ThumbnailerField
from django.conf import settings

from mainapp.managers import CustomUserManager


# Custom user model
class CustomUser(AbstractUser):
    username = models.CharField(max_length=40, unique=True, null=True, verbose_name="Username")
    email = models.EmailField(unique=True, verbose_name="Email address")
    # ThumbnailerField should be here because django cleanup won't delete thumbnails if ImageField or FileField is used
    photo = ThumbnailerField(
        null=True,
        blank=True,
        verbose_name="Photo",
        validators=[validators.FileExtensionValidator(allowed_extensions=('jpg', 'png'))],
        error_messages={'invalid_extension': 'This format does not supported.'}
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.username


# Category, contains lots of products with same qualities
class Category(models.Model):
    name = models.CharField(max_length=60, verbose_name='Name')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'
        verbose_name = 'Category'


# Product, some good selling in the shop
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name='Category')
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='products_created', verbose_name='Created by')

    title = models.CharField(max_length=60, verbose_name='Title')
    description = models.CharField(max_length=600, blank=True, null=True, verbose_name='Description')
    image = ThumbnailerField(
        null=True,
        blank=True,
        verbose_name='Image',
        validators=[validators.FileExtensionValidator(allowed_extensions=('jpg', 'png'))],
        error_messages={'invalid_extension': 'This format does not supported.'}
    )
    price = models.DecimalField(max_digits=7, decimal_places=2, verbose_name='Price')
    in_stock = models.BooleanField(default=True, verbose_name='In stock')
    is_active = models.BooleanField(default=True, verbose_name='Is active')
    published = models.DateTimeField(auto_now_add=True, verbose_name='Published in')
    updated = models.DateTimeField(auto_now=True, verbose_name='Updated in')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Products'
        verbose_name = 'Product'
        ordering = ['-published']


"""
# For the future
# Represents shopping cart, may contain multiple products
class Cart(models.Model):
    creation_date = models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Creation date')
    # TODO: Need to find what to add here from others
    # Many-to-many field (because a single cart may contain multiple products and multiple carts may contain the same product)
    # Foreign key field (because cart owner is out user and nobody else)
"""
