import json
from django.shortcuts import render, HttpResponse, redirect, HttpResponseRedirect
from . import APP_NAME
from viewer import views as viewer_views
from .viewer_widgets import widgets
from feature_list.viewer_widgets import widgets as feature_list_widgets
from django.contrib.auth.decorators import login_required


VIEW_MAP_TPL = "%s/view.html" % APP_NAME
NEW_EDIT_TPL = "%s/new.html" % APP_NAME


def view_map(request, instance_id):
    context = dict(widgets=feature_list_widgets + widgets)
    return viewer_views.view_app(request, instance_id, template="%s/view.html" % APP_NAME, context=context)


@login_required
def new(request):
    context = dict(widgets=widgets)
    return viewer_views.new(request, app_name=APP_NAME, context=context)

@login_required
def edit(request, instance_id):
    context = dict(widgets=widgets)
    return viewer_views.edit(request, instance_id, context=context)\

@login_required
def upload(request):
    json_response = dict(success=False)
    return HttpResponse(json.dumps(json_response),content_type="text/json")