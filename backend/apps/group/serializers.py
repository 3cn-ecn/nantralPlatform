from datetime import date

from django.utils.translation import gettext as _

from rest_framework import exceptions, serializers

from apps.student.serializers import StudentPreviewSerializer

from .models import Group, GroupType, Membership


class AdminFieldsMixin:
    """
    A mixin to add support for 'admin_fields': an admin field can only
    be updated by an admin of the corresponding group.
    """

    def validate_admin_fields(self, data: dict[str, any], group: Group) -> None:
        admin_fields = self.Meta.admin_fields
        if admin_fields == "__all__":
            admin_fields = self.fields
        if self.instance:
            an_admin_field_is_updated = any(
                data.get(field) and getattr(self.instance, field) != data[field]
                for field in admin_fields
            )
        else:
            an_admin_field_is_updated = any(
                data.get(field) for field in admin_fields
            )
        user = self.context["request"].user
        if an_admin_field_is_updated and not group.is_admin(user):
            raise exceptions.PermissionDenied(
                _("Some fields cannot be updated by non-admins."),
            )


class GroupTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupType
        fields = ["name", "slug", "no_membership_dates"]


class GroupPreviewSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ["name", "short_name", "slug", "url", "icon", "id"]
        read_only_fields = ["name", "short_name", "slug", "url", "icon"]

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()


class GroupSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    group_type = GroupTypeSerializer(read_only=True)
    parent = GroupPreviewSerializer(read_only=True)

    class Meta:
        model = Group
        exclude = [
            "members",
            "subscribers",
            "priority",
            "social_links",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
            "lock_memberships",
        ]
        read_only_fields = ["group_type", "parent", "url"]

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_is_admin(self, obj: Group) -> bool:
        return obj.is_admin(self.context["request"].user)

    def get_is_member(self, obj: Group) -> bool:
        return obj.is_member(self.context["request"].user)


class GroupWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        exclude = [
            "members",
            "subscribers",
            "priority",
            "social_links",
            "created_at",
            "created_by",
            "updated_at",
            "updated_by",
            "lock_memberships",
        ]
        read_only_fields = ["group_type", "parent", "url"]

    def validate(self, data):
        if not self.instance:
            group_type = self.context["request"].query_params.get("type")
            data["group_type"] = GroupType.objects.get(slug=group_type)
        return super().validate(data)


class MembershipSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    """Membership serializer for getting or editing objects."""

    student = StudentPreviewSerializer(read_only=True)
    group = GroupPreviewSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = [
            "id",
            "student",
            "group",
            "summary",
            "description",
            "begin_date",
            "end_date",
            "priority",
            "admin",
            "admin_request",
        ]
        read_only_fields = ["id", "student", "group", "admin_request"]
        admin_fields = ["priority", "admin"]

    def validate_begin_date(self, value: date) -> date:
        group_type: GroupType = self.instance.group.group_type
        if not group_type.no_membership_dates and value is None:
            raise exceptions.ValidationError(_("This field is required."))
        return value

    def validate_end_date(self, value: date) -> date:
        group_type: GroupType = self.instance.group.group_type
        if not group_type.no_membership_dates and value is None:
            raise exceptions.ValidationError(_("This field is required."))
        return value

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        if (
            data.get("begin_date")
            and data.get("end_date")
            and data["begin_date"] > data["end_date"]
        ):
            raise exceptions.ValidationError(
                _("The end date must be after the begin date."),
            )
        self.validate_admin_fields(data, self.instance.group)
        return data


class NewMembershipSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    """Membership serializer for creating new objets."""

    class Meta:
        model = Membership
        fields = [
            "student",
            "group",
            "summary",
            "description",
            "begin_date",
            "end_date",
            "admin",
        ]
        admin_fields = ["admin"]

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        group: Group = data["group"]
        user = self.context["request"].user  # the user making the request
        if not (user.student == data["student"] or group.is_admin(user)):
            raise exceptions.PermissionDenied(
                _(
                    "You can only create new membership for yourself or for "
                    "someone else inside a group where you are admin.",
                ),
            )
        if (group.private or group.lock_memberships) and not group.is_admin(
            user,
        ):
            raise exceptions.PermissionDenied(
                _(
                    "You cannot create create a new membership inside a private"
                    " group if you are not admin of this group.",
                ),
            )
        if data.get("end_date") and data.get("begin_date"):
            if data["begin_date"] > data["end_date"]:
                raise exceptions.ValidationError(
                    _("The end date must be after the begin date."),
                )
        elif not group.group_type.no_membership_dates:
            raise exceptions.ValidationError(
                _("You must provides 'begin_date' and 'end_date'."),
            )
        self.validate_admin_fields(data, group)
        return data
