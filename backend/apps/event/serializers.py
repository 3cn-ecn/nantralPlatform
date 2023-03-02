from rest_framework import serializers

from .models import Event
from apps.student.models import Student


class EventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    absolute_url = serializers.ReadOnlyField()
    group_name = serializers.SerializerMethodField()
    group_slug = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    class Meta:
        model = Event
        read_only_fields = ['absolute_url', 'slug',
                            'number_of_participants', 'color']
        fields = [
            'title',
            'description',
            'location',
            'date',
            'end_date',
            'publicity',
            'image',
            'slug',
            'number_of_participants',
            'absolute_url',
            'group',
            'group_slug',
            'group_name',
            'is_participating',
            'is_member',
            'max_participant',
            'begin_inscription',
            'end_inscription',
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

    def get_group_slug(self, obj):
        return obj.group.slug

    def get_absolute_url(self, obj: Event):
        return obj.get_absolute_url()


class EventParticipatingSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['name', 'get_absolute_url', 'id']
