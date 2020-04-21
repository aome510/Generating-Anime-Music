from django.shortcuts import render
from django.http import JsonResponse

from . import deploy


def index(request):
    return render(request, 'index.html')


def get_midi_binary_data_json(request):
    return JsonResponse(deploy.generate_song())


def get_midi_events_json(request):
    return JsonResponse(deploy.generate_midi_events())
