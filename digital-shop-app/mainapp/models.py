from django.db import models
from django.core import validators
from easy_thumbnails.fields import ThumbnailerField
from django.conf import settings


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
