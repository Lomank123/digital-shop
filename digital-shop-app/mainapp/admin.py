from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from mainapp.models import Product, Category, CustomUser
from mainapp.forms import CustomUserCreationForm, CustomUserChangeForm


# Here we can configure how the model will look like in admin dashboard
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    # Controls which fields are displayed on the change list(!) page of the admin.
    list_display = ('email', 'username', 'is_staff', 'is_active', 'date_joined',)
    # Controls what filters are available
    list_filter = ('date_joined', 'is_staff', 'is_active',)
    # When editing user
    fieldsets = (
        ('Information', {'fields': ('email', 'username', 'photo', 'password')}),
        ('Permissions', {'fields': ('is_staff', 'is_active')}),
    )
    # When creating new user via admin dashboard
    add_fieldsets = (
        (
            None,
            {
                # CSS style classes
                'classes': ('wide',),
                'fields': ('email', 'photo', 'password1', 'password2', 'is_staff', 'is_active')
            }
        ),
    )
    # Search
    search_fields = ('email',)
    # Ordering
    ordering = ('email',)


class ProductAdmin(admin.ModelAdmin):
    model = Product
    list_display = ('title', 'category', 'price', 'created_by', 'description', 'in_stock', 'is_active', 'published', 'updated',)
    list_filter = ('created_by', 'category', 'is_active', 'in_stock', 'title')
    fieldsets = (
        ('Information', {'fields': ('title', 'category', 'price', 'image', 'created_by', 'description', 'in_stock', 'is_active',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('title', 'category', 'price', 'image', 'created_by', 'description', 'in_stock', 'is_active',)
            }
        ),
    )
    search_fields = ('created_by', 'category', 'title', 'description',)
    ordering = ('category', 'title', 'created_by',)


class CategoryAdmin(admin.ModelAdmin):
    model = Category
    list_display = ('name',)
    list_filter = ('name',)
    fieldsets = (
        ('Information', {'fields': ('name',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('name',)
            }
        ),
    )
    search_fields = ('name',)
    ordering = ('name',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
