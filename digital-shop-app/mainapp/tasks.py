from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from mainapp.models import Cart
import mainapp.consts as consts


@shared_task
def add(x, y):
    return f"Sum is: {x + y}"

@shared_task
def delete_expired_carts():
    """
    This task will delete all expired non-user carts.
    Expiration date equals to cookie expiration date.
    """
    expiration_date = timezone.now() - timedelta(days=consts.CART_ID_COOKIE_EXPIRATION_DAYS)
    expired_carts = Cart.objects.filter(creation_date__lte=expiration_date, user=None)
    res = f"{expired_carts.count()} carts have been deleted."
    expired_carts.delete()
    return res
