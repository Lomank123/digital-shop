# Generated by Django 3.2.12 on 2022-02-23 17:59

from django.conf import settings
import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import mainapp.validators


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='CustomUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('username', models.CharField(max_length=20, unique=True, verbose_name='Username')),
                ('email', models.EmailField(max_length=64, unique=True, verbose_name='Email address')),
                ('photo', models.FileField(blank=True, error_messages={'invalid_extension': 'This format does not supported.'}, null=True, upload_to='', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=('jpg', 'png')), mainapp.validators.validate_file_size], verbose_name='Photo')),
                ('is_seller', models.BooleanField(default=False, verbose_name='Seller')),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='Deleted')),
                ('is_archived', models.BooleanField(default=False, verbose_name='Archived')),
                ('creation_date', models.DateTimeField(auto_now_add=True, db_index=True, verbose_name='Creation date')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user', to=settings.AUTH_USER_MODEL, verbose_name='User')),
            ],
            options={
                'verbose_name': 'Cart',
                'verbose_name_plural': 'Carts',
                'ordering': ['-creation_date'],
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=60, unique=True, verbose_name='Name')),
                ('verbose', models.CharField(max_length=60, unique=True, validators=[mainapp.validators.validate_whitespaces], verbose_name='Verbose')),
            ],
            options={
                'verbose_name': 'Category',
                'verbose_name_plural': 'Categories',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('cart', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='mainapp.cart', verbose_name='Cart')),
                ('creation_date', models.DateTimeField(auto_now_add=True, verbose_name='Creation date')),
                ('total_price', models.DecimalField(decimal_places=2, max_digits=7, verbose_name='Total price')),
            ],
            options={
                'verbose_name': 'Order',
                'verbose_name_plural': 'Orders',
                'ordering': ['-cart__id'],
            },
        ),
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=60, verbose_name='Title')),
                ('description', models.CharField(blank=True, default='', max_length=600, verbose_name='Description')),
                ('image', models.FileField(blank=True, error_messages={'invalid_extension': 'This format does not supported.'}, null=True, upload_to='', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=('jpg', 'png')), mainapp.validators.validate_file_size], verbose_name='Image')),
                ('price', models.DecimalField(decimal_places=2, max_digits=7, validators=[django.core.validators.MinValueValidator(0.01)], verbose_name='Price')),
                ('quantity', models.IntegerField(default=0, verbose_name='Quantity')),
                ('is_active', models.BooleanField(default=True, verbose_name='Is active')),
                ('published', models.DateTimeField(auto_now_add=True, verbose_name='Published in')),
                ('updated', models.DateTimeField(auto_now=True, verbose_name='Updated in')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='products', to='mainapp.category', verbose_name='Category')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_by', to=settings.AUTH_USER_MODEL, verbose_name='Created by')),
            ],
            options={
                'verbose_name': 'Product',
                'verbose_name_plural': 'Products',
                'ordering': ['-published'],
            },
        ),
        migrations.CreateModel(
            name='CartItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField(default=1, verbose_name='Quantity')),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cart', to='mainapp.cart', verbose_name='Cart')),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='product', to='mainapp.product', verbose_name='Product')),
            ],
            options={
                'verbose_name': 'Cart item',
                'verbose_name_plural': 'Cart items',
                'ordering': ['-id'],
            },
        ),
    ]
