from rest_framework import serializers

from apps.account.models import User
from apps.sociallink.serializers import SocialLinkSerializer

from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()
    username = serializers.SerializerMethodField()
    expires_at = serializers.SerializerMethodField()
    social_links = SocialLinkSerializer(many=True)

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

    def get_expires_at(self, obj: Student) -> str | None:
        user: User = obj.user
        # send expiring date only to the current user
        if self.context["request"].user != user or not user.invitation:
            return None
        return user.invitation.expires_at


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
