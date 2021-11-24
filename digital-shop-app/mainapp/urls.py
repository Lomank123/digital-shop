from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from mainapp.views import EntityViewSet, UserViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_auth.views import PasswordResetConfirmView


router = DefaultRouter()
router.register('entities', EntityViewSet, basename='users')

urlpatterns = [
    # API urls
    path('api/', include(router.urls)),
    # REST Auth
    path('api/rest-auth/', include('rest_auth.urls')),
    path('api/rest-auth/registration/', include('rest_auth.registration.urls')),
    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Other urls
    path('api-auth/', include('rest_framework.urls')),
]
