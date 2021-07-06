

def appname(request):
    return {
        'appname': request.resolver_match.namespace,
    }