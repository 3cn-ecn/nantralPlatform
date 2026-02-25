from django.utils.translation import gettext as _

from rest_framework import serializers

from apps.group.models import Group
from apps.group.serializers import GroupPreviewSerializer
from apps.utils.translation_model_serializer import TranslationModelSerializer

from .models import Post


class PostSerializer(TranslationModelSerializer):
    is_admin = serializers.SerializerMethodField()
    can_pin = serializers.SerializerMethodField()
    group = GroupPreviewSerializer()

    class Meta:
        model = Post
        fields = "__all__"

    def get_is_admin(self, obj: Post) -> bool:
        user = self.context["request"].user
        return obj.group.is_admin(user)

    def get_can_pin(self, obj: Post) -> str:
        user = self.context["request"].user
        return user.can_pin()


class PostPreviewSerializer(PostSerializer):
    class Meta(PostSerializer.Meta):
        fields = [
            "id",
            "title",
            "group",
            "created_at",
            "updated_at",
            "image",
            "pinned",
            "is_admin",
            "publicity",
        ]


class PostWriteSerializer(TranslationModelSerializer):
    class Meta:
        model = Post
        exclude = [
            "notification",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
        ]
        translations_fields = ["title", "description"]
        translations_only = True

    def validate_group(self, value: Group) -> Group:
        if not value.is_admin(self.context["request"].user):
            raise serializers.ValidationError(
                _("You have to be admin to add or update a post"),
            )
        return value
