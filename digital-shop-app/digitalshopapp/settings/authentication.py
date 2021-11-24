import os


# Auth settings

# Sets custom user model
#AUTH_USER_MODEL = 'coreapp.CustomUser'

# Login
LOGIN_REDIRECT_URL = '/home/'
LOGIN_URL = '/login/'

# Logout
LOGOUT_URL = '/logout/'
LOGOUT_REDIRECT_URL = '/login/'

# django-allauth params

SITE_ID = 1
# Set this to "mandatory"
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True