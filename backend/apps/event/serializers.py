from rest_framework import serializers

from .models import Event
from apps.student.models import Student


class EventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()
    group_name = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Event
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
            'group_slug',
            'group_name',
            'is_participating',
            'is_member',
            'max_participant',
            'end_inscription',
            'begin_inscription',
            'end_date',
            'form_url',
            'is_favorite']

    def get_is_participating(self, obj):
        user = self.context['request'].user
        return obj.is_participating(user)

    def get_is_member(self, obj):
        user = self.context['request'].user
        group = obj.group
        return group.is_member(user)

    def get_is_favorite(self, obj):
        user = self.context['request'].user
        return obj.is_favorite(user)

    def get_group_name(self, obj):
        return obj.group.name


class EventParticipatingSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['name', 'get_absolute_url']
