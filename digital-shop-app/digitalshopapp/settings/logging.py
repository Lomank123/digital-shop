from digitalshopapp.settings.settings import BASE_DIR


# Logging settings
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'filters': {
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'filter_info_level': {
            '()': 'digitalshopapp.log_middleware.FilterLevels',
            'filter_levels': {
                'INFO',
            },
        },
        'filter_error_level': {
            '()': 'digitalshopapp.log_middleware.FilterLevels',
            'filter_levels': {
                'ERROR',
            },
        },
    },
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(levelname)s : %(message)s',
            'datefmt': '%Y.%m.%d %H:%M:%S',
        },
        'error': {
            'format': '%(asctime)s - %(levelname)s : %(message)s - [in %(pathname)s : %(lineno)s]',
            'datefmt': '%Y.%m.%d %H:%M:%S',
        },
        'info': {
            'format': '%(levelname)s : %(message)s',
        },
    },
    'handlers': {
        'console_prod': {
            'class': 'logging.StreamHandler',
            'formatter': 'error',
            'level': 'ERROR',
            'filters': ['require_debug_false'],
        },
        'info_handler': {
            'class': 'logging.StreamHandler',
            'formatter': 'info',
            'filters': ['require_debug_true', 'filter_info_level'],
        },
        'error_handler': {
            'class': 'logging.StreamHandler',
            'formatter': 'error',
            'filters': ['require_debug_true', 'filter_error_level'],
        }
    },
    'loggers': {
        'django': {
            'handlers': ['info_handler', 'error_handler', 'console_prod'],
        }
    },
}
