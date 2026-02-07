from datetime import datetime
from typing import TYPE_CHECKING

from rest_framework import serializers

from apps.sociallink.serializers import SocialLinkSerializer

from ..account.serializers import ShortEmailSerializer
from .models import Student

if TYPE_CHECKING:
    from apps.account.models import User


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    expires_at = serializers.SerializerMethodField()
    social_links = SocialLinkSerializer(many=True, read_only=True)
    emails = serializers.SerializerMethodField()

    class Meta:
        model = Student
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

    def get_name(self, obj: Student) -> str:
        return obj.name

    def get_url(self, obj: Student) -> str:
        return obj.get_absolute_url()

    def get_staff(self, obj: Student) -> bool:
        return obj.user.is_staff

    def get_username(self, obj: Student) -> str:
        return obj.user.username

    def get_expires_at(self, obj: Student) -> datetime | None:
        user: User = obj.user
        # send expiring date only to the current user
        request_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            request_user = request.user

        if request_user != user or not user.invitation:
            return None
        return user.invitation.expires_at

    def get_emails(self, obj: Student) -> list[dict]:
        return ShortEmailSerializer(
            obj.user.emails.filter(is_visible=True), many=True
        ).data


class StudentPreviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ["id", "name", "url", "picture"]
        read_only = ["picture"]

    def get_name(self, obj: Student) -> str:
        return obj.name

    def get_url(self, obj: Student) -> str:
        return obj.get_absolute_url()
