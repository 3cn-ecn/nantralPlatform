from rest_framework.exceptions import MethodNotAllowed
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from .models import SocialLink
from .permissions import GroupSocialLinkPermission, UserSocialLinkPermission
from .serializers import GroupSocialLinkSerializer, UserSocialLinkSerializer


class GroupSocialLinkViewSet(ModelViewSet):
    queryset = SocialLink.objects.all()
    permission_classes = [GroupSocialLinkPermission, IsAuthenticated]
    serializer_class = GroupSocialLinkSerializer

    def list(self, request):
        raise MethodNotAllowed("GET", detail='Method "GET" not allowed')


class UserSocialLinkViewSet(ModelViewSet):
    queryset = SocialLink.objects.all()
    permission_classes = [UserSocialLinkPermission, IsAuthenticated]
    serializer_class = UserSocialLinkSerializer

    def list(self, request):
        raise MethodNotAllowed("GET", detail='Method "GET" not allowed')
