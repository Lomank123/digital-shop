from decimal import Decimal
from django.db import models
from django.core import validators
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

from mainapp.managers import CustomUserManager
from mainapp.validators import validate_file_size


# Custom user model
class CustomUser(AbstractUser):
    username = models.CharField(max_length=20, unique=True, verbose_name="Username")
    email = models.EmailField(max_length=64, unique=True, verbose_name="Email address")
    photo = models.FileField(
        null=True,
        blank=True,
        verbose_name="Photo",
        validators=[validators.FileExtensionValidator(allowed_extensions=("jpg", "png")), validate_file_size],
        error_messages={"invalid_extension": "This format does not supported."}
    )
    is_seller = models.BooleanField(default=False, verbose_name="Seller")

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email


# Category, contains lots of products with same qualities
class Category(models.Model):
    name = models.CharField(max_length=60, unique=True, verbose_name="Name")
    slug = models.SlugField(max_length=60, unique=True, verbose_name="Slug")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"
        verbose_name = "Category"
        ordering = ["-id"]


# Product, some good selling in the shop
class Product(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="products", verbose_name="Category")
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="created_by",
        verbose_name="Created by"
    )

    title = models.CharField(max_length=60, verbose_name="Title")
    description = models.CharField(max_length=600, default="", blank=True, verbose_name="Description")
    image = models.FileField(
        null=True,
        blank=True,
        verbose_name="Image",
        validators=[validators.FileExtensionValidator(allowed_extensions=("jpg", "png")), validate_file_size],
        error_messages={"invalid_extension": "This format does not supported."}
    )
    price = models.DecimalField(
        max_digits=7,
        decimal_places=2,
        verbose_name="Price",
        validators=[validators.MinValueValidator(0.01)]
    )
    quantity = models.IntegerField(default=0, verbose_name="Quantity")
    is_active = models.BooleanField(default=True, verbose_name="Is active")
    published = models.DateTimeField(auto_now_add=True, verbose_name="Published in")
    updated = models.DateTimeField(auto_now=True, verbose_name="Updated in")

    @property
    def in_stock(self) -> bool:
        "Returns True if quantity of a product is more than 0"
        return self.quantity > 0

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = "Products"
        verbose_name = "Product"
        ordering = ["-published"]


class Cart(models.Model):
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        verbose_name="User",
        related_name="user"
    )
    is_deleted = models.BooleanField(default=False, verbose_name="Deleted")
    is_archived = models.BooleanField(default=False, verbose_name="Archived")
    creation_date = models.DateTimeField(verbose_name="Creation date")

    def save(self, *args, **kwargs):
        if self.creation_date is None:
            self.creation_date = timezone.now()
        super(Cart, self).save(*args, **kwargs)

    class Meta:
        verbose_name_plural = "Carts"
        verbose_name = "Cart"
        ordering = ["-creation_date"]


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, verbose_name="Cart", related_name="cart")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name="Product", related_name="product")
    quantity = models.IntegerField(default=1, verbose_name="Quantity")

    @property
    def total_price(self) -> Decimal:
        "Returns total price for amount of product"
        return self.quantity * self.product.price

    class Meta:
        verbose_name_plural = "Cart items"
        verbose_name = "Cart item"
        ordering = ["-id"]


class Address(models.Model):
    name = models.CharField(max_length=120, verbose_name="Name")
    available = models.BooleanField(default=True, verbose_name="Available")

    class Meta:
        verbose_name_plural = "Addresses"
        verbose_name = "Address"
        ordering = ["-id"]

    def __str__(self):
        return self.name


class Order(models.Model):
    cart = models.OneToOneField(Cart, on_delete=models.CASCADE, primary_key=True, verbose_name="Cart")
    address = models.ForeignKey(Address, on_delete=models.CASCADE, verbose_name="Address")
    # Payment method can be either "cash" or "card"
    payment_method = models.CharField(max_length=60, default="cash", verbose_name="Payment method")
    creation_date = models.DateTimeField(auto_now_add=True, verbose_name="Creation date")
    total_price = models.DecimalField(max_digits=7, decimal_places=2, verbose_name="Total price")

    class Meta:
        verbose_name_plural = "Orders"
        verbose_name = "Order"
        ordering = ["-cart__id"]
