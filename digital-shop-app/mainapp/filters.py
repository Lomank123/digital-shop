from django_filters import rest_framework as filters
from mainapp.models import Product


class ProductFilter(filters.FilterSet):
    price_from = filters.NumberFilter(field_name="price", lookup_expr="gte")
    price_to = filters.NumberFilter(field_name="price", lookup_expr="lte")
    published_date = filters.DateFromToRangeFilter(field_name="published")
    in_stock = filters.NumberFilter(field_name="quantity", lookup_expr="gte")

    class Meta:
        model = Product
        fields = [
            'category__verbose',
            'created_by__id',
            'in_stock',
            'is_active',
            'price_from',
            'price_to',
            'published_date',
        ]

