from django.contrib import admin
from django.urls import path

from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('generated_song.mid', views.get_generated_song, name='generated_song'),
    path('midi_events.json', views.get_midi_events_json, name='midi_events'),
]
