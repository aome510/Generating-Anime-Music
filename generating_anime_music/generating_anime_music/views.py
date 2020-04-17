from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from wsgiref.util import FileWrapper
import os

from . import deploy


def index(request):
    return render(request, 'index.html')


def get_generated_song(request):
    # generate generated_song.mid
    deploy.generate_song()

    # send generated_song.mid to user
    filename = 'generated_song.mid'
    wrapper = FileWrapper(open(os.path.abspath('generated_song.mid'), 'rb'))
    response = HttpResponse(wrapper, content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=%s' % os.path.basename(filename)
    response['Content-Length'] = os.path.getsize(filename)
    return response


def get_midi_events_json(request):
    return JsonResponse(deploy.generate_midi_events())
