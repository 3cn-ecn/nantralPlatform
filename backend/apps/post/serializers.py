from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    group_slug = serializers.SerializerMethodField()
    can_edit = serializers.SerializerMethodField()
    can_pin = serializers.SerializerMethodField()

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
            'group_slug',
            'color',
            'image',
            'publicity',
            'pinned',
            'page_suggestion',
            'description',
            'can_edit',
            'can_pin'
        ]

    def get_group_slug(self, obj: Post) -> str:
        return obj.group.slug

    def get_can_edit(self, obj: Post) -> str:
        user = self.context['request'].user
        return obj.group.is_admin(user)

    def get_can_pin(self, obj: Post) -> str:
        user = self.context['request'].user
        return obj.group.can_pin_post(user)
