from django.contrib import admin
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin
from rest_framework_simplejwt.token_blacklist import models

from mainapp.models import Product, Category, CustomUser, CartItem, Cart, Order, Address


# Here we can configure how the model will look like in admin dashboard
@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    model = CustomUser
    # Controls which fields are displayed on the change list(!) page of the admin.
    list_display = ('email', 'username', 'is_staff', 'is_superuser', 'is_active', 'date_joined', 'is_seller')
    # Controls what filters are available
    list_filter = ('is_staff', 'is_active', 'is_seller')
    # When editing user
    fieldsets = (
        ('Information', {'fields': ('email', 'username', 'photo', 'password',)}),
        ('Permissions', {
            'fields': ('is_superuser', 'is_staff', 'is_active', 'is_seller', 'user_permissions', 'groups')
        }),
    )
    # When creating new user via admin dashboard
    add_fieldsets = (
        (
            None,
            {
                # CSS style classes
                'classes': ('wide',),
                'fields': (
                    'email',
                    'username',
                    'photo',
                    'password1',
                    'password2',
                    'is_superuser',
                    'is_staff',
                    'is_active',
                    'user_permissions',
                    'groups',
                    'is_seller',
                )
            }
        ),
    )
    # Search
    search_fields = ('email',)
    # Ordering
    ordering = ('email',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    model = Product
    list_display = ('id', 'title', 'category', 'price', 'created_by', 'in_stock', 'is_active', 'published', 'updated',)
    list_filter = ('category', 'is_active',)
    fieldsets = (
        ('Information', {'fields': (
            'title', 'category', 'price', 'quantity', 'image', 'created_by', 'description', 'is_active',
        )}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('title', 'category', 'price', 'quantity', 'image', 'created_by', 'description', 'is_active',)
            }
        ),
    )
    search_fields = ('created_by', 'category', 'title',)
    ordering = ('category', 'title', 'created_by',)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ('name', 'slug',)
    list_filter = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    fieldsets = (
        ('Information', {'fields': ('name', 'slug',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('name', 'slug',)
            }
        ),
    )
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    model = Cart
    list_display = ('id', 'user', 'is_deleted', 'is_archived', 'creation_date', )
    list_filter = ('is_deleted', 'is_archived', )
    fieldsets = (
        ('Information', {'fields': ('user', 'creation_date', 'is_deleted', 'is_archived', )}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('user', 'is_deleted', 'is_archived',)
            }
        ),
    )
    search_fields = ('id', 'user',)
    ordering = ('creation_date', 'id')


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    model = CartItem
    list_display = ('id', 'cart', 'product', 'quantity', )
    fieldsets = (
        ('Information', {'fields': ('cart', 'product', 'quantity',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('cart', 'product', 'quantity',)
            }
        ),
    )
    search_fields = ('id', 'cart', 'product',)
    ordering = ('cart', 'product', 'id')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    model = Order
    list_display = ('cart', 'total_price', 'creation_date', 'address', 'payment_method', )
    list_filter = ('payment_method', )
    fieldsets = (
        ('Information', {'fields': ('cart', 'total_price', 'address', 'payment_method', )}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('cart', 'total_price', 'address', 'payment_method', )
            }
        ),
    )
    search_fields = ('total_price', 'cart', )
    ordering = ('creation_date', 'total_price', )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    model = Address
    list_display = ('id', 'name', 'available', )
    list_filter = ('available', )
    fieldsets = (
        ('Information', {'fields': ('name', 'available', )}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('name', 'available', )
            }
        ),
    )
    search_fields = ('name', )
    ordering = ('id', 'name', 'available', )


class CustomOutstandingTokenAdmin(OutstandingTokenAdmin):

    # Need to return True here so we can delete user with these tokens via admin panel
    def has_delete_permission(self, *args, **kwargs):
        return True


# Unregistring and registring new outstanding token admin model
admin.site.unregister(models.OutstandingToken)
admin.site.register(models.OutstandingToken, CustomOutstandingTokenAdmin)
