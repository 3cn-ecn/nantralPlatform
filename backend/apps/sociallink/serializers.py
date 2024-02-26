from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from apps.group.models import Group

from .models import SocialLink, SocialNetwork


class NetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialNetwork
        fields = ["id", "name", "color", "icon_name"]


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "uri", "network", "label"]
        depth = 1


class SocialLinkUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["id", "uri", "network", "label"]


class SocialLinkCreateSerializer(serializers.ModelSerializer):
    group = serializers.SlugField(write_only=True)

    class Meta:
        model = SocialLink
        fields = ["uri", "network", "label", "network", "group"]

    def validate_group(self, val: str):
        if not Group.objects.filter(slug=val).exists():
            raise ValidationError("Group slug does not exist")
        return val

    def create(self, validated_data: dict):
        group = validated_data.pop("group", None)
        social_link = SocialLink.objects.create(**validated_data)
        if group:
            group = Group.objects.get(slug=group)
            group.social_links.add(social_link)
            group.save()

        return social_link
