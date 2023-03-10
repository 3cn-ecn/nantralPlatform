from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    group_slug = serializers.SerializerMethodField()

    def validate(self, attrs):
        if (not attrs["group"].is_admin(self.context['request'].user)):
            raise serializers.ValidationError(
                "You have to be admin to add or update an event")
        return super().validate(attrs)

    class Meta:
        model = Post
        read_only_fields = ['slug']
        fields = [
            'id',
            'slug',
            'title',
            'publication_date',
            'group',
            'group_slug',
            'color',
            'image',
            'publicity',
            'pinned',
            'page_suggestion',
            'description',
        ]

    def get_group_slug(self, obj: Post) -> str:
        return obj.group.slug
