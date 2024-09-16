from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import SocialLink
from .permissions import SocialLinkPermission
from .serializers import GroupSocialLinkSerializer


class GroupSocialLinkViewSet(ModelViewSet):
    queryset = SocialLink.objects.all()
    permission_classes = [SocialLinkPermission, IsAuthenticated]
    serializer_class = GroupSocialLinkSerializer

    def list(self, request):
        raise MethodNotAllowed("GET", detail='Method "GET" not allowed')
