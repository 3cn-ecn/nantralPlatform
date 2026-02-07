from datetime import datetime

from rest_framework import serializers

from apps.account.models import User
from apps.sociallink.serializers import SocialLinkSerializer

from ..account.serializers import ShortEmailSerializer


class StudentSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()
    expires_at = serializers.SerializerMethodField()
    social_links = SocialLinkSerializer(many=True, read_only=True)
    emails = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "promo",
            "picture",
            "faculty",
            "path",
            "url",
            "staff",
            "description",
            "social_links",
            "emails",
            "username",
            "expires_at",
        ]

    def get_url(self, obj: User) -> str:
        return obj.get_absolute_url()

    def get_staff(self, obj: User) -> bool:
        return obj.is_staff

    def get_expires_at(self, obj: User) -> datetime | None:
        # send expiring date only to the current user
        request_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            request_user = request.user

        if request_user != obj or not obj.invitation:
            return None
        return obj.invitation.expires_at

    def get_emails(self, obj: User) -> list[dict]:
        return ShortEmailSerializer(
            obj.emails.filter(is_visible=True), many=True
        ).data


class StudentPreviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "url", "picture"]
        read_only = ["picture"]

    def get_name(self, obj: User) -> str:
        return obj.name

    def get_url(self, obj: User) -> str:
        return obj.get_absolute_url()
