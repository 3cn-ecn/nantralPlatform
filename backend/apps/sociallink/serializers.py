from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError

from apps.account.models import User
from apps.group.models import Group

from .models import SocialLink


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "uri", "label"]


class GroupSocialLinkSerializer(serializers.ModelSerializer):
    group = serializers.SlugField(write_only=True, required=False)

    class Meta:
        model = SocialLink
        fields = ["id", "uri", "label", "group"]

    def validate_group(self, val: str):
        if not Group.objects.filter(slug=val).exists():
            raise ValidationError("Group slug does not exist")
        return val

    def create(self, validated_data: dict):
        group = validated_data.pop("group", None)
        if group is None:
            raise ValidationError("Group slug is required")
        group = Group.objects.get(slug=group)
        social_link = group.social_links.create(**validated_data)
        return social_link


class UserSocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = [
            "id",
            "uri",
            "label",
        ]


class UserCreateSocialLinkSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = SocialLink
        fields = [
            "id",
            "uri",
            "label",
            "user",
        ]

    def validate_user(self, val: User):
        current_user = self.context["request"].user
        if current_user != val and not current_user.is_superuser:
            raise PermissionDenied
        return val

    def create(self, validated_data: dict):
        user: User = validated_data.pop("user")

        if user is None:
            raise ValidationError("An error occurred")

        social_link = user.social_links.create(**validated_data)

        return social_link
