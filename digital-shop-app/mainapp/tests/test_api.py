import json
from django.test import TestCase
from django.urls import reverse

from rest_framework import status


class ProductAPITestCase(TestCase):

    def setUp(self) -> None:
        #user = CustomUser.objects.create_user(email='testapi@gmail.com', password='123')
        #user2 = CustomUser.objects.create_user(email='testapi2@gmail.com', password='123')
        ## post and put methods are testing using user2
        #self.client.login(username='testapi2@gmail.com', password='123')
        pass