from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import serializers

from apps.group.models import Group
from apps.group.serializers import GroupPreviewSerializer
from apps.utils.translation_model_serializer import TranslationModelSerializer

from .models import Event, SportEvent


class SportEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = SportEvent
        read_only_fields = ["id"]
        fields = [
            "id",
            "type",
            "description",
            "date",
            "location",
            "participants",
            "non_participants",
            "owner",
        ]
        translations_fields = ["description"]

    def validate_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError(
                _("The date cannot be in the past."),
            )
        return value

    def validate_owner(self, value: Group) -> Group:
        user = self.context["request"].user
        if not value.is_admin(user):
            raise serializers.ValidationError(
                _("You have to be an admin of the organizer group."),
            )
        return value

    def validate(self, data: dict) -> dict:
        data = super().validate(data)
        user = self.context["request"].user
        owner = data.get("owner", getattr(self.instance, "owner", None))
        date = data.get("date", getattr(self.instance, "date", None))
        participants = data.get(
            "participants",
            list(self.instance.participants.all()) if self.instance else [],
        )
        non_participants = data.get(
            "non_participants",
            list(self.instance.non_participants.all()) if self.instance else [],
        )

        if date is not None and date < timezone.now():
            raise serializers.ValidationError(
                {"date": _("The date cannot be in the past.")},
            )
        if owner is not None and not owner.is_admin(user):
            raise serializers.ValidationError(
                {"owner": _("You have to be an admin of the organizer group.")}
            )
        participant_ids = {participant.id for participant in participants}
        non_participant_ids = {user.id for user in non_participants}
        overlap = participant_ids & non_participant_ids
        if overlap:
            raise serializers.ValidationError(
                {
                    "participants": _(
                        "A user cannot be both a participant and a non-participant.",
                    ),
                    "non_participants": _(
                        "A user cannot be both a participant and a non-participant.",
                    ),
                },
            )
        return data


class EventSerializer(TranslationModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    group = GroupPreviewSerializer()
    is_group_member = serializers.SerializerMethodField()
    is_group_admin = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    form_url = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Event
        read_only_fields = [
            "absolute_url",
            "slug",
            "id",
            "number_of_participants",
            "color",
        ]
        fields = [
            "id",
            "title",
            "description",
            "location",
            "start_date",
            "end_date",
            "publicity",
            "image",
            "number_of_participants",
            "url",
            "group",
            "is_group_member",
            "is_group_admin",
            "is_participating",
            "is_bookmarked",
            "max_participant",
            "start_registration",
            "end_registration",
            "form_url",
            "notification",
        ]
        translations_fields = ["title", "description"]

    def get_is_participating(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.participants.contains(user)

    def get_is_group_member(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.group.is_member(user)

    def get_is_group_admin(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.group.is_admin(user)

    def get_is_bookmarked(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.bookmarks.contains(user)

    def get_url(self, obj: Event) -> str:
        return obj.get_absolute_url()

    def get_form_url(self, obj: Event) -> str:
        user = self.context["request"].user
        registration_open = (
            obj.start_registration is None
            or obj.start_registration < timezone.now()
        ) and (
            obj.end_registration is None
            or obj.end_registration > timezone.now()
        )
        if registration_open or obj.group.is_admin(user):
            return obj.form_url
        return ""


class EventPreviewSerializer(EventSerializer):
    class Meta(EventSerializer.Meta):
        fields = [
            "id",
            "title",
            "start_date",
            "end_date",
            "group",
            "image",
            "is_group_admin",
            "is_participating",
            "is_bookmarked",
            "number_of_participants",
            "max_participant",
            "form_url",
            "start_registration",
            "end_registration",
            "url",
        ]
        translations_fields = []


class EventWriteSerializer(TranslationModelSerializer):
    class Meta(EventSerializer.Meta):
        model = Event
        fields = [
            "id",
            "location",
            "start_date",
            "end_date",
            "publicity",
            "image",
            "group",
            "max_participant",
            "start_registration",
            "end_registration",
            "form_url",
        ]
        translations_fields = ["title", "description"]
        translations_only = True

    def validate_max_participant(self, value: int) -> int:
        if value and value < 1:
            raise serializers.ValidationError(_("Must be a positive integer"))
        return value

    def validate_group(self, value: Group) -> Group:
        if not value.is_admin(self.context["request"].user):
            raise serializers.ValidationError(
                _("You have to be admin to add or update an event"),
            )
        return value

    def validate(self, data: dict) -> dict:
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError(
                _("The end date must be after the begin date."),
            )
        if (
            data.get("start_registration")
            and data.get("end_registration")
            and data["start_registration"] > data["end_registration"]
        ):
            raise serializers.ValidationError(
                _(
                    "The end-registration date must be after the start-"
                    "registration date.",
                ),
            )
        return super().validate(data)
