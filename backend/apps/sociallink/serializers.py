from typing import TYPE_CHECKING

from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.group.models import Group

if TYPE_CHECKING:
    from ..account.models import User
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

    def create(self, validated_data: dict):
        user: User = self.context["request"].user

        if user is None:
            raise ValidationError("An error occurred")

        social_link = user.social_links.create(**validated_data)

        return social_link
