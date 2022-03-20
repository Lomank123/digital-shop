from __future__ import absolute_import, unicode_literals
from celery import shared_task
from datetime import timedelta
from django.utils import timezone
from mainapp.models import Cart
import mainapp.consts as consts


@shared_task
def delete_expired_carts():
    """
    This task will delete all expired non-user carts.
    Expiration date equals to cookie expiration date.
    """
    expiration_date = timezone.now() - timedelta(days=consts.CART_ID_COOKIE_EXPIRATION_DAYS)
    expired_carts = Cart.objects.filter(creation_date__lte=expiration_date, user=None)
    count = expired_carts.count()
    expired_carts.delete()
    # Here we're using another variable instead of expired_carts.count() because after deletion it'll return wrong value
    res = f"{count} carts have been deleted."
    return res
