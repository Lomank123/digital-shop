from django.shortcuts import render
from django.views.generic import TemplateView

from mainapp.models import CustomEntity


class CustomTemplateView(TemplateView):
	template_name = 'mainapp/home.html'

	def get_context_data(self, **kwargs):
		context = super().get_context_data(**kwargs)
		context["entities"] = CustomEntity.objects.all()
		return context
	


