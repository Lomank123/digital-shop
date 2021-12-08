from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from mainapp.views import EntityViewSet, UserViewSet, app, VerifyTokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from dj_rest_auth.registration.views import VerifyEmailView


router = DefaultRouter()
router.register('entities', EntityViewSet, basename='users')

urlpatterns = [
    # Start page
    path('', app),
    # Login, Logout, etc.
    path('login/', app),
    path('logout/', app),
    path('loggedin/', app),
    # Signup
    path('signup/', app),
    path('signup/email-sent', app),
    re_path(r'signup/confirm/(?P<key>[-:\w]+)/$', app),
    # Forgot password
    path('forgot/', app),
    path('forgot/email-sent', app),
    # Reset password
    re_path(r'reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$', app),
    path('reset/confirm/', app),
    # Test
    path('test/', app),

    # API urls
    path('api/', include(router.urls)),
    path('api/verify-tokens/', VerifyTokens.as_view(), name='verify-tokens'),
    # REST Auth
    path('api/dj-rest-auth/', include('dj_rest_auth.urls')),
    path('api/dj-rest-auth/registration/', include('dj_rest_auth.registration.urls')),
    
    # JWT Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # Other urls
    path('api-auth/', include('rest_framework.urls')),
]
