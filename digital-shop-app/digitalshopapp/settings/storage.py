import os
from .settings import BASE_DIR


# Static dirs
STATICFILES_DIRS = (os.path.join(BASE_DIR, 'static'),)

# Static
STATIC_ROOT = '/vol/web/static'
STATIC_URL = '/static/'

# Media
MEDIA_ROOT = '/vol/web/media'
MEDIA_URL = '/media/'

# Thumbnails
THUMBNAIL_MEDIA_ROOT = '/vol/web/media/thumbnails'
THUMBNAIL_MEDIA_URL = '/media/thumbnails/'
THUМВNAIL_DEFAULT_OPТIONS = {'quality': 90, 'subsampling': 1, }
THUMBNAIL_ALIASES = {
    # Preset for user photo
    'placerem.CustomUser.photo': {
        'default_user_photo': {
            'size': (150, 200),
            'crop': 'scale',
        },
        'small_user_photo': {
            'size': (50, 50),
            'crop': 'scale',
        },
    },
    # Presets for the whole project
    '': {
        'default': {
            'size': (180, 240),
            'crop': 'scale',
        },
        'big': {
            'size': (480, 640),
            'crop': '10,10',
        },
        'small': {
            'size': (30, 30),
            'crop': 'scale',
        },
    },
}
