from datetime import timedelta
from django.utils import timezone
from django.test import TestCase

from digitalshopapp.celery import app
from mainapp.tasks import delete_expired_carts
from mainapp.models import Cart, CustomUser
from mainapp import consts


class CeleryTasksTestCase(TestCase):

    # Initial data
    def setUp(self) -> None:
        app.conf.update(CELERY_ALWAYS_EAGER=True, BROKER_BACKEND='memory')
        time = timezone.now() - timedelta(days=consts.CART_ID_COOKIE_EXPIRATION_DAYS + 10)
        self.cart1 = Cart.objects.create(creation_date=time)
        self.cart2 = Cart.objects.create(creation_date=timezone.now())
        # User and their cart
        self.user = CustomUser.objects.create_user(email="test1@gmail.com", username="test1", password="1234")
        self.user_cart = Cart.objects.create(creation_date=time, user=self.user)

    def test_delete_expired_carts(self):
        self.assertEqual(Cart.objects.count(), 3)
        task = delete_expired_carts.apply()
        self.assertEqual(task.status, 'SUCCESS')
        self.assertEqual(Cart.objects.count(), 2)
        self.assertEqual(task.get(), "1 carts have been deleted.")
