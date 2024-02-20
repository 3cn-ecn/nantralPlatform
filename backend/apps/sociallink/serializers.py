from rest_framework import serializers

from apps.group.models import Group

from .models import SocialLink, SocialNetwork


class NetworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialNetwork
        fields = ["id", "name", "color", "icon_name"]


class SocialLinkSerializer(serializers.ModelSerializer):
    network = NetworkSerializer()

    class Meta:
        model = SocialLink
        fields = ["id", "uri", "network", "label"]


class SocialLinWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ["uri", "network", "label", "network"]

    def create(self, validated_data):
        social_link = super().create(validated_data)
        view = self.context.get("view")
        group_slug = view and view.kwargs.get("group_slug")
        if group_slug:
            group = Group.objects.get(slug=group_slug)
            group.social_links.add(social_link)
            group.save()
        return social_link
