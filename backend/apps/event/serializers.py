from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import serializers

from apps.group.models import Group
from apps.group.serializers import GroupPreviewSerializer

from .models import Event


class EventSerializer(serializers.ModelSerializer):
    number_of_participants = serializers.ReadOnlyField()
    group = GroupPreviewSerializer()
    is_group_member = serializers.SerializerMethodField()
    is_group_admin = serializers.SerializerMethodField()
    is_participating = serializers.SerializerMethodField()
    is_bookmarked = serializers.SerializerMethodField()
    form_url = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        language = settings.LANGUAGES
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

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            for language_code in settings.LANGUAGES:
                description_name = f"description_{language_code}"
                title_name = f"description_{language_code}"
                self.fields[description_name] = serializers.CharField(
                    source=f"description_{language_code}"
                )
                self.fields[title_name] = serializers.CharField(
                    source=f"title_{language_code}"
                )

    def get_is_participating(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.participants.contains(user.student)

    def get_is_group_member(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.group.is_member(user)

    def get_is_group_admin(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.group.is_admin(user)

    def get_is_bookmarked(self, obj: Event) -> bool:
        user = self.context["request"].user
        return obj.bookmarks.contains(user.student)

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


class EventWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        language = settings.LANGUAGES
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

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)

            for language_code in settings.LANGUAGES:
                description_name = f"description_{language_code}"
                title_name = f"description_{language_code}"
                self.fields[description_name] = serializers.CharField(
                    source=f"description_{language_code}"
                )
                self.fields[title_name] = serializers.CharField(
                    source=f"title_{language_code}"
                )

    def validate_max_participant(self, value: int) -> int:
        if value and value < 1:
            raise serializers.ValidationError(_("Must be a positive integer"))
        return value

    def validate_group(self, value: Group) -> Group:
        if not value.is_admin(self.context["request"].user):
            raise serializers.ValidationError(
                _("You have to be admin to add or update an event")
            )
        return value

    def validate(self, data: dict) -> dict:
        if data["start_date"] > data["end_date"]:
            raise serializers.ValidationError(
                _("The end date must be after the begin date.")
            )
        if (
            data.get("start_registration")
            and data.get("end_registration")
            and data["start_registration"] > data["end_registration"]
        ):
            raise serializers.ValidationError(
                _(
                    "The end-registration date must be after the start-"
                    "registration date."
                )
            )
        return super().validate(data)
