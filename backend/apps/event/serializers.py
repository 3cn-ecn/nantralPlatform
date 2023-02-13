from rest_framework import serializers

from .models import BaseEvent
from apps.student.models import Student


class BaseEventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()
    group_name = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = BaseEvent
        fields = [
            'title',
            'description',
            'location',
            'date',
            'publicity',
            'color',
            'image',
            'slug',
            'number_of_participants',
            'get_absolute_url',
            'group',
            'group_name',
            'is_participating',
            'is_member']

    def get_is_participating(self, obj):
        user = self.context['request'].user
        return obj.is_participating(user)

    def get_is_member(self, obj):
        user = self.context['request'].user
        group = obj.get_group()
        return group.is_member(user)

    def get_group_name(self, obj):
        return obj.get_group().name


class EventParticipatingSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['name', 'get_absolute_url']
