from rest_framework import serializers

from .models import Post


class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = [
            'title',
            'description',
            'publication_date',
            'color',
            'image',
            'slug',
            'publicity',
            'group_slug',
            'pinned',
            'page_suggestion'
        ]
