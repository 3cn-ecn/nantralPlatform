from rest_framework import serializers

from .models import Post
from apps.group.serializers import SimpleGroupSerializer


class PostSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    can_pin = serializers.SerializerMethodField()
    group = SimpleGroupSerializer()

    def validate(self, attrs):
        if (not attrs["group"].is_admin(self.context['request'].user)):
            raise serializers.ValidationError(
                "You have to be admin to add or update a post")
        return super().validate(attrs)

    class Meta:
        model = Post
        read_only_fields = ['slug']
        fields = [
            'id',
            'slug',
            'title',
            'publication_date',
            'updated_at',
            'group',
            'color',
            'image',
            'publicity',
            'pinned',
            'page_suggestion',
            'description',
            'is_admin',
            'can_pin',
        ]

    def get_is_admin(self, obj: Post) -> str:
        user = self.context['request'].user
        return obj.group.is_admin(user)

    def get_can_pin(self, obj: Post) -> str:
        user = self.context['request'].user
        return user.student.can_pin()
