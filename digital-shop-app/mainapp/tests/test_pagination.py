from django.test import TestCase, RequestFactory
from mainapp.pagination import DefaultCustomPagination
from mainapp.models import Product, Category, CustomUser
from mainapp.serializers import ProductSerializer
from rest_framework.request import Request


class DefaultCustomPaginationTestCase(TestCase):

    def setUp(self):
        self.pagination = DefaultCustomPagination()
        self.superuser = CustomUser.objects.create_superuser(
            email="super1@gmail.com",
            username="super1",
            password="123"
        )
        self.category = Category.objects.create(
            name="Test category 1",
            slug="test-category-1"
        )
        self.product = Product.objects.create(
            category=self.category,
            created_by=self.superuser,
            title="Test title 1",
            price=40.0,
            quantity=20
        )

    def test_get_paginated_response(self):
        request = Request(RequestFactory().request())
        queryset = Product.objects.all()
        page = self.pagination.paginate_queryset(queryset, request)
        serializer = ProductSerializer(page, many=True)
        response = self.pagination.get_paginated_response(serializer.data)
        self.assertEqual(response.data["number"], 1)
        self.assertEqual(response.data["num_pages"], 1)
        self.assertTrue(response.data["last"])
        self.assertTrue(response.data["first"])

    def test_get_first_link(self):
        request = Request(RequestFactory().request())
        self.pagination.request = request
        url = self.pagination.get_first_link()
        self.assertEqual(url, "http://testserver/")

    def test_get_last_link(self):
        request = Request(RequestFactory().request())
        queryset = Product.objects.all()
        self.pagination.paginate_queryset(queryset, request)
        self.pagination.request = request
        url = self.pagination.get_last_link()
        self.assertEqual(url, "http://testserver/?page=1")
