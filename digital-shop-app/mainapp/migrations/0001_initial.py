# Generated by Django 3.2.9 on 2021-11-12 18:31

import django.core.validators
from django.db import migrations, models
import easy_thumbnails.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomEntity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', easy_thumbnails.fields.ThumbnailerField(blank=True, error_messages={'invalid_extension': 'This format does not supported'}, null=True, upload_to='', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=('jpg', 'png'))], verbose_name='Photo')),
            ],
        ),
    ]
