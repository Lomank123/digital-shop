from django.db import models
from django.core import validators
from easy_thumbnails.fields import ThumbnailerField


class CustomEntity(models.Model):
    photo = ThumbnailerField(
        null=True,
        blank=True,
        verbose_name="Photo",
        validators=[validators.FileExtensionValidator(allowed_extensions=('jpg', 'png'))],
        error_messages={'invalid_extension': 'This format does not supported'}
    )
