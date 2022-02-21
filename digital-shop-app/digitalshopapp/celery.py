from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", 'digitalshopapp.settings')

app = Celery("digitalshopapp")
app.config_from_object("django.conf:settings", namespace="CELERY")

app.conf.beat_schedule = {
    # TODO: Delete after tests
    #'add-every-20-seconds': {
    #    'task': 'mainapp.tasks.add',
    #    'schedule': 20.0,
    #    'args': (2, 2),
    #},
    'delete-expired-carts-daily': {
        'task': 'mainapp.tasks.delete_expired_carts',
        'schedule': crontab(minute=0, hour=0),
    },
}

app.autodiscover_tasks()
