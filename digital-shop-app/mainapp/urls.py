from django.urls import path

from mainapp.views import CustomTemplateView


urlpatterns = [
    path('home/', CustomTemplateView.as_view(), name='home'),
]

