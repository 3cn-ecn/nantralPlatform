from django.shortcuts import render

from . import utils

def camarche(request):
    return render(request, 'search_bar/truc.html', {})

def search_bar(request):
    if request.method == 'POST':
        search_result = utils.get_searched(request)
        return render(request, 'search_bar/index.html',search_result)
    else:
        return render(request, 'search_bar/index.html',{})
