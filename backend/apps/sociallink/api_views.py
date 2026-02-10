from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import SocialLink
from .permissions import GroupSocialLinkPermission, UserSocialLinkPermission
from .serializers import (
    GroupSocialLinkSerializer,
    UserCreateSocialLinkSerializer,
    UserSocialLinkSerializer,
)


class GroupSocialLinkViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = SocialLink.objects.all()
    permission_classes = [GroupSocialLinkPermission, IsAuthenticated]
    serializer_class = GroupSocialLinkSerializer


class UserSocialLinkViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = SocialLink.objects.all()
    permission_classes = [UserSocialLinkPermission, IsAuthenticated]
    serializer_class = UserSocialLinkSerializer

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSocialLinkSerializer
        return UserSocialLinkSerializer
