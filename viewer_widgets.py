from django.templatetags.static import static
from . import APP_NAME

widgets = [{
    'title': 'Collector',
    'name': 'collector',

    'config': {
        'directive': 'collector-config',
        'dependencies': ["dndLists"],
        'js': [
            static("%s/js/config/config-directive.js" % APP_NAME),
            static("%s/vendor/angular-drag-and-drop-lists.min.js" % APP_NAME),

        ],
        "css": [
            static("%s/css/config.css" % APP_NAME),
        ]
    },
    'view': {
        'directive': 'collector',
        'js': [
            static("%s/js/view/app.js" % APP_NAME),
            static("%s/js/view/collector.js" % APP_NAME),
            static("%s/js/view/main-controller.js" % APP_NAME),
        ],
        "css": [
            static("%s/css/view.css" % APP_NAME),
        ]
    },
}]