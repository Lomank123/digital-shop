import json
from django.test import TestCase
from django.urls import reverse

from rest_framework import status


class AuthTestCase(TestCase):

    # Initial data
    def setUp(self) -> None:
        pass