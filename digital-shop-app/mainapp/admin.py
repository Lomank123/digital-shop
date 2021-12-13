from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from mainapp.models import CustomEntity, CustomUser
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


class CustomEntityAdmin(admin.ModelAdmin):
    model = CustomEntity
    list_display = ('user', 'description', 'photo',)
    list_filter = ('user',)
    fieldsets = (
        ('Information', {'fields': ('user', 'description', 'photo',)}),
    )
    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('user', 'description', 'photo',)
            }
        ),
    )
    search_fields = ('description',)
    ordering = ('user',)


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(CustomEntity, CustomEntityAdmin)
