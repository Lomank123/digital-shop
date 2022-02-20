from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from mainapp.models import Cart
import mainapp.consts as consts


@shared_task
def delete_expired_carts():
    """
    This task will delete all expired carts without any owner.
    Expiration date - 1 month (equals to cookie expiration date).
    """
    days = consts.CART_ID_COOKIE_EXPIRATION_DAYS
    expiration_date = timezone.now() - timedelta(days=days)
    expired_carts = Cart.objects.filter(creation_date__lte=expiration_date, user=None)
    res = f"{expired_carts.count()} carts have been deleted."
    expired_carts.delete()
    return res