from rest_framework import serializers, exceptions
from datetime import datetime
from .models import Event
from apps.student.models import Student
from django.utils.translation import gettext as _


class EventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    absolute_url = serializers.ReadOnlyField()
    group_name = serializers.SerializerMethodField()
    group_slug = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()

    def validate_date(self, value: datetime) -> datetime:
        if value.time() < datetime.today().time():
            raise exceptions.ValidationError(
                _("Can't create an event in the past."))
        return value

    def validate(self, attrs):
        if (not attrs["group"].is_admin(self.context['request'].user)):
            raise serializers.ValidationError(
                "You have to be admin to add or update an event")
        if (attrs["end_date"] and attrs["date"] > attrs["end_date"]):
            raise exceptions.ValidationError(_(
                "The end date must be after the begin date."))
        if (attrs["begin_inscription"] and attrs["end_inscription"]
                and attrs["begin_inscription"] > attrs["end_inscription"]):
            raise serializers.ValidationError(
                "End inscription date should be greater than begin inscription\
                 date")
        return super().validate(attrs)

    class Meta:
        model = Event
        read_only_fields = ['absolute_url', 'slug', 'id',
                            'number_of_participants', 'color']
        fields = [
            'id',
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

    def get_is_participating(self, obj: Event):
        user = self.context['request'].user
        return obj.is_participating(user)

    def get_is_member(self, obj: Event):
        user = self.context['request'].user
        group = obj.group
        return group.is_member(user)

    def get_is_favorite(self, obj: Event):
        user = self.context['request'].user
        return obj.is_favorite(user)

    def get_group_name(self, obj: Event):
        return obj.group.name

    def get_group_slug(self, obj: Event):
        return obj.group.slug

    def get_absolute_url(self, obj: Event):
        return obj.get_absolute_url()


class EventParticipatingSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['name', 'get_absolute_url', 'id']
