from django.conf import settings
from django.utils.translation import gettext as _

from rest_framework import serializers

from apps.group.models import Group
from apps.group.serializers import GroupPreviewSerializer

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    can_pin = serializers.SerializerMethodField()
    group = GroupPreviewSerializer()

    class Meta:
        model = Post
        exclude = ["notification"]

    def get_is_admin(self, obj: Post) -> bool:
        user = self.context["request"].user
        return obj.group.is_admin(user)

    def get_can_pin(self, obj: Post) -> str:
        user = self.context["request"].user
        return user.student.can_pin()


class PostPreviewSerializer(PostSerializer):
    class Meta(PostSerializer.Meta):
        language = settings.LANGUAGES
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
        exclude = None

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            for language_code in settings.LANGUAGES:
                description_name = f"description_{language_code}"
                title_name = f"description_{language_code}"
                self.fields[description_name] = serializers.CharField(
                    source=f"description_{language_code}"
                )
                self.fields[title_name] = serializers.CharField(
                    source=f"title_{language_code}"
                )


class PostWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        exclude = [
            "title",
            "description",
            "notification",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
        ]

    def validate_group(self, value: Group) -> Group:
        if not value.is_admin(self.context["request"].user):
            raise serializers.ValidationError(
                _("You have to be admin to add or update a post")
            )
        return value
