from django_filters import rest_framework as filters
from mainapp.models import Product


class ProductFilter(filters.FilterSet):
    min_price = filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = filters.NumberFilter(field_name="price", lookup_expr="lte")

    class Meta:
        model = Product
        fields = ['category__verbose', 'created_by__id', 'quantity', 'is_active', 'min_price', 'max_price']

