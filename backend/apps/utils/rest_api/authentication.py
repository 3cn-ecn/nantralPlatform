from rest_framework import authentication


class SessionAuthentication(authentication.SessionAuthentication):
    """
    This class is needed, because REST Framework's default SessionAuthentication
    does never return 401's, because they cannot fill the WWW-Authenticate
    header with a valid value in the 401 response. As a result, we cannot
    distinguish calls that are not unauthorized (401 unauthorized) and calls
    for which the user does not have permission (403 forbidden). See
    https://github.com/encode/django-rest-framework/issues/5968

    We do set authenticate_header function in SessionAuthentication, so that a
    value for the WWW-Authenticate header can be retrieved and the response
    code is automatically set to 401 in case of unauthenticated requests.
    """

    def authenticate_header(self, request):
        return "Session"
