from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import SocialLink, SocialNetwork
from .permissions import SocialLinkPermission
from .serializers import (
    NetworkSerializer,
    SocialLinkCreateSerializer,
    SocialLinkSerializer,
    SocialLinkUpdateSerializer,
)


class SocialNetworkViewSet(ModelViewSet):
    http_method_names = ["get"]
    queryset = SocialNetwork.objects.all()
    serializer_class = NetworkSerializer


class SocialLinkViewSet(ModelViewSet):
    queryset = SocialLink.objects.all()
    permission_classes = [SocialLinkPermission, IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == "POST":
            return SocialLinkCreateSerializer
        if self.request.method == "PUT":
            return SocialLinkUpdateSerializer
        return SocialLinkSerializer

    def list(self, request):
        raise MethodNotAllowed("GET", detail='Method "GET" not allowed')
