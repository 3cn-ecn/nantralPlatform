from django.shortcuts import redirect


def redirect_to_list(request):
    return redirect('group:sub_index', 'club')


def redirect_to_club(request, slug):
    return redirect('group:detail', slug)
