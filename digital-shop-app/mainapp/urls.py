from django.urls import path, include, re_path
from rest_framework.routers import DefaultRouter
from mainapp.views import EntityViewSet, UserViewSet, app, VerifyTokens
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


router = DefaultRouter()
router.register('entities', EntityViewSet, basename='users')

urlpatterns = [
    # Start page
    path('', app),
    path('login/', app),
    path('signup/', app),
    path('logout/', app),
    path('forgot/', app),
    path('loggedin/', app),
    path('test/', app),
    re_path(r'reset/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})/$', app),
    # Need to convert this to django regex
    #path="/reset/:uid([0-9A-Za-z_\-]+)/:token([0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,32})"

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
