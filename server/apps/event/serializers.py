from rest_framework import serializers

from .models import BaseEvent


class BaseEventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()
    get_group_name = serializers.ReadOnlyField()
    is_participating = serializers.SerializerMethodField()

    class Meta:
        model = BaseEvent
        fields = ['title', 'description', 'location',
                  'date', 'publicity', 'color', 'image', 'slug', 'number_of_participants', 'get_absolute_url', 'group', 'get_group_name', 'is_participating']

    def get_is_participating(self, obj):
        user = self.context['request'].user
        return obj.is_participating(user)
