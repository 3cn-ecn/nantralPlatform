from django.utils.translation import gettext as _

from rest_framework import serializers

from apps.group.serializers import GroupPreviewSerializer

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    can_pin = serializers.SerializerMethodField()
    group = GroupPreviewSerializer()

    class Meta:
        model = Post
        exclude = ['notification']

    def get_is_admin(self, obj: Post) -> str:
        user = self.context['request'].user
        return obj.group.is_admin(user)

    def get_can_pin(self, obj: Post) -> str:
        user = self.context['request'].user
        return user.student.can_pin()


class PostPreviewSerializer(PostSerializer):
    class Meta(PostSerializer.Meta):
        fields = ['id', 'title', 'group', 'created_at',
                  'updated_at', 'image', 'pinned', 'is_admin', 'publicity']
        exclude = None


class PostWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Post
        exclude = ['notification', 'created_at',
                   'created_by', 'updated_at', 'updated_by']

    def validate(self, attrs):
        if (not attrs["group"].is_admin(self.context['request'].user)):
            raise serializers.ValidationError(
                _("You have to be admin to add or update a post"))
        return super().validate(attrs)
