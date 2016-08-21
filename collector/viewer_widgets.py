from django.templatetags.static import static
widgets = [{
    'title': 'Collector',
    'name': 'collector',

    'config': {
        'directive': 'collector-config',
        'dependencies': ["dndLists"],
        'js': [
            static("collector/js/config/config-directive.js"),
            static("collector/vendor/angular-drag-and-drop-lists.min.js"),

        ],
        "css": [
            static("collector/css/config.css"),
            # "https://code.getmdl.io/1.1.3/material.cyan-light_blue.min.css"
        ]
    },
    'view': {
        'directive': 'collector',
        'js': [
            static("collector/js/view/app.js"),
            static("collector/js/view/collector.js"),
            static("collector/js/view/main-controller.js"),
        ],
        "css": [
            static("collector/css/view.css"),
        ]
    },
}]