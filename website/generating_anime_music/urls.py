from django.contrib import admin
from django.urls import path

from . import views, deploy

deploy.init()

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('midi_events.json', views.get_midi_events_json, name='midi_events'),
    path('midi_binary_data.json', views.get_midi_binary_data_json, name='midi_binary_data'),
]
