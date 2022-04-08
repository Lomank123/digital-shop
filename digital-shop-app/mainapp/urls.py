from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from mainapp.views import ProductViewSet, CategoryViewSet, UserViewSet, \
    CartViewSet, CartItemViewSet, EmailAddressViewSet, OrderViewSet, AddressViewSet


router = DefaultRouter()
router.register('product', ProductViewSet, basename='product')
router.register('category', CategoryViewSet, basename='category')
router.register('user-info', UserViewSet, basename='user-info')
router.register('cart', CartViewSet, basename='cart')
router.register('cart-item', CartItemViewSet, basename='cart-item')
router.register('email-address', EmailAddressViewSet, basename='email-address')
router.register('order', OrderViewSet, basename='order')
router.register('address', AddressViewSet, basename='address')

urlpatterns = [
    # API urls
    path('api/', include(router.urls)),
    # REST Auth
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
