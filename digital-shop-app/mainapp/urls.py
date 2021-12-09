from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from mainapp.views import EntityViewSet, UserViewSet, app, VerifyTokens, auth
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from dj_rest_auth.registration.views import VerifyEmailView


router = DefaultRouter()
router.register('entities', EntityViewSet, basename='users')

urlpatterns = [
    # Start page
    path('', app),
    # Test
    path('test/', app),

    # AUTH Urls
    # TODO: Maybe convert auth logic in a separate django app
    # Login, Logout, etc.
    path('login/', auth),
    path('logout/', auth),
    path('loggedin/', auth),
    # Signup
    path('signup/', auth),
    path('signup/email-sent', auth),
    re_path(r'signup/confirm/(?P<key>[-:\w]+)/$', auth),
    # Forgot password
    path('forgot/', auth),
    path('forgot/email-sent', auth),
    # Reset password
    re_path(r'reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$', auth),
    path('reset/confirm/', auth),

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
