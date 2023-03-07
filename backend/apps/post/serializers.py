from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    group_slug = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'title',
            'publication_date',
            'color',
            'image',
            'slug',
            'publicity',
            'pinned',
            'page_suggestion',
            'group_slug',
            'description',
        ]

    def get_group_slug(self, obj: Post) -> str:
        return obj.group.slug
