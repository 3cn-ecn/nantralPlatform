from rest_framework import serializers, exceptions
from django.utils import timezone
from .models import Event
from apps.student.models import Student
from django.utils.translation import gettext as _
from apps.group.serializers import SimpleGroupSerializer


class EventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    absolute_url = serializers.ReadOnlyField()
    group = SimpleGroupSerializer()
    is_participating = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    form_url = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    def validate_max_participant(self, value: int) -> int:
        if value and value < 1:
            raise exceptions.ValidationError(
                _("Must be a positive integer"))
        return value

    def validate(self, attrs):
        if (not attrs["group"].is_admin(self.context['request'].user)):
            raise serializers.ValidationError(
                "You have to be admin to add or update an event")
        if (attrs["start_date"] > attrs["end_date"]):
            raise exceptions.ValidationError(_(
                "The end date must be after the begin date."))
        if (attrs.get("start_registration") and attrs.get("end_registration")
                and attrs["start_registration"] > attrs["end_registration"]):
            raise serializers.ValidationError(
                "End registration date should be greater than begin \
                    registration date")
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
            'start_date',
            'end_date',
            'publicity',
            'image',
            'slug',
            'number_of_participants',
            'absolute_url',
            'group',
            'is_participating',
            'is_member',
            'max_participant',
            'start_registration',
            'end_registration',
            'form_url',
            'is_favorite',
            'is_admin']

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

    def get_is_admin(self, obj: Event):
        user = self.context['request'].user
        return obj.group.is_admin(user)

    def get_absolute_url(self, obj: Event):
        return obj.get_absolute_url()

    def get_form_url(self, obj: Event):
        user = self.context['request'].user
        registration_open: bool = (
            (obj.start_registration is None
             or obj.start_registration < timezone.now())
            and (obj.end_registration is None
                 or obj.end_registration > timezone.now())
        )
        # don't send url if the registrations are not open and user is not admin
        if (obj.form_url and not registration_open
                and not obj.group.is_admin(user)):
            return "#"
        return obj.form_url


class WriteEventSerializer(serializers.ModelSerializer):

    class Meta:
        model = Event
        fields = [
            'title',
            'description',
            'location',
            'start_date',
            'end_date',
            'publicity',
            'image',
            'group',
            'max_participant',
            'start_registration',
            'end_registration',
            'form_url']


class EventParticipatingSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField()
    get_absolute_url = serializers.ReadOnlyField()

    class Meta:
        model = Student
        fields = ['name', 'get_absolute_url', 'id']
