from rest_framework import serializers

from .models import BaseEvent


class BaseEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = BaseEvent
        fields = ['title', 'description', 'location',
                  'date', 'publicity', 'color', 'image', 'slug']
