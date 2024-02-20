from rest_framework.viewsets import ModelViewSet

from .models import SocialNetwork
from .serializers import NetworkSerializer


class SocialNetworkViewSet(ModelViewSet):
    http_method_names = ["get"]
    queryset = SocialNetwork.objects.all()
    serializer_class = NetworkSerializer
