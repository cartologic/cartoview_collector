import json
from django.shortcuts import render, HttpResponse, redirect, HttpResponseRedirect
from . import APP_NAME
from cartoview.app_manager.models import AppInstance, App
# from cartoview_map_viewer import views as viewer_views
from .viewer_widgets import widgets
from cartoview_feature_list.viewer_widgets import widgets as feature_list_widgets
from django.contrib.auth.decorators import login_required
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
from cartoview.app_manager.views import _resolve_appinstance

VIEW_MAP_TPL = "%s/view.html" % APP_NAME
NEW_EDIT_TPL = "%s/new.html" % APP_NAME


def view_map(request, instance_id):
    context = dict(widgets=feature_list_widgets + widgets)
    template=VIEW_MAP_TPL
    instance = _resolve_appinstance(request, instance_id, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
    context.update({
        "map_config": instance.map.viewer_json(request.user,None),
        "instance": instance
    })
    return render(request, template, context)
def save(request, instance_id=None, app_name=APP_NAME):
    res_json = dict(success=False)
    # try:
    
    map_id = request.POST.get('map', None)
    title = request.POST.get('title', "")
    config = request.POST.get('config', None)
    abstract = request.POST.get('abstract', "")
    if instance_id is None:
        instance_obj = AppInstance()
        instance_obj.app = App.objects.get(name=app_name)
        instance_obj.owner = request.user
    else:
        instance_obj = AppInstance.objects.get(pk=instance_id)
    instance_obj.title = title
    instance_obj.config = config
    instance_obj.abstract = abstract
    instance_obj.map_id = map_id
    instance_obj.save()
    res_json.update(dict(success=True, id=instance_obj.id))
    # except Exception, e:
    #     print e
    #     res_json["error_message"] = str(e)
    return HttpResponse(json.dumps(res_json), content_type="application/json")   
@login_required
def new(request,template="%s/edit.html" % APP_NAME, app_name=APP_NAME, context={}):
    context = dict(widgets=widgets)
    if request.method == 'POST':
        return save(request, app_name=app_name)
    return render(request, template, context)

@login_required
def edit(request, instance_id, template="%s/edit.html" % APP_NAME, context={}): 
     instance = _resolve_appinstance(request, instance_id, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
     context.update({
        "map_config": instance.map.viewer_json(request.user,None),
        "instance": instance
     })
     return render(request, template, context)
     
@login_required
def upload(request):
    json_response = dict(success=False)
    return HttpResponse(json.dumps(json_response),content_type="text/json")