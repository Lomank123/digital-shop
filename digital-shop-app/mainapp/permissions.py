from rest_framework import permissions
from rest_framework.exceptions import NotAuthenticated


class IsOwnerOrReadOnly(permissions.BasePermission):
	"""
	Object-level permission to only allow owners of an object to edit it.
	Assumes the model instance has an `created_by` attribute.
	"""

	def has_object_permission(self, request, view, obj):
		# Read permissions are allowed to any request,
		# so we'll always allow GET, HEAD or OPTIONS requests.
		if request.method in permissions.SAFE_METHODS:
			return True	
		# Instance must have an attribute named `created_by`.
		return obj.created_by == request.user


class IsSellerOrReadOnly(permissions.BasePermission):

	"""
	Seller permission. Assumes the user instance has an `is_seller` attribute.
	"""

	def has_permission(self, request, view):
		if request.method in permissions.SAFE_METHODS:
			return True

		try:
			permission = bool(request.user and request.user.is_seller)
			return permission
		except AttributeError:
			raise NotAuthenticated()
