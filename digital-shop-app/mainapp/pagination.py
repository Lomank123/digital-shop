from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.utils.urls import replace_query_param, remove_query_param
from collections import OrderedDict


class ProductPagination(PageNumberPagination):
	"""
	Custom pagination class. Used for products pagination.
	Has additional fields and some configured params.
	
	Additional fields:
		- 'number' - contains number of a current page
		- 'num_pages' - contains pages count number
		- 'first' - url to the first page
		- 'last' - url to the last page

	"""
	page_size = 10
	page_query_param = 'page'
	max_page_size = 20

	def get_paginated_response(self, data):
		return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('number', self.page.number),
            ('num_pages', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
			('first', self.get_first_link()),
			('last', self.get_last_link()),
            ('results', data)
        ]))

	# Returns url for the first page
	def get_first_link(self):
		url = self.request.build_absolute_uri()
		return remove_query_param(url, self.page_query_param)

	# Returns url for the last page
	def get_last_link(self):
		url = self.request.build_absolute_uri()
		page_number = self.page.paginator.num_pages
		return replace_query_param(url, self.page_query_param, page_number)
