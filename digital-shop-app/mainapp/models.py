from django.db import models
from django.core import validators
from django.contrib.auth.models import AbstractUser
from easy_thumbnails.fields import ThumbnailerField
from django.conf import settings

from mainapp.managers import CustomUserManager


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
        return self.email


class CustomEntity(models.Model):
    description = models.CharField(max_length=300, verbose_name='Description', blank=True, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, verbose_name='User')
    photo = ThumbnailerField(
        null=True,
        blank=True,
        verbose_name="Photo",
        validators=[validators.FileExtensionValidator(allowed_extensions=('jpg', 'png'))],
        error_messages={'invalid_extension': 'This format does not supported'}
    )
