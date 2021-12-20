from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from mainapp.views import ProductViewSet, CategoryViewSet, UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register('product', ProductViewSet, basename='product')
router.register('category', CategoryViewSet, basename='category')
router.register('user-info', UserViewSet, basename='user-info')

urlpatterns = [
    # API urls
    path('api/', include(router.urls)),
    # REST Auth
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
