from datetime import date

from django.db.models.query_utils import Q
from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import exceptions, serializers

from apps.sociallink.serializers import (
    GroupSocialLinkSerializer,
    SocialLinkSerializer,
)
from apps.student.serializers import StudentPreviewSerializer

from ..account.models import User
from .models import Group, GroupType, Label, Membership


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
    can_create = serializers.SerializerMethodField()

    class Meta:
        model = GroupType
        fields = [
            "name",
            "slug",
            "is_map",
            "no_membership_dates",
            "can_create",
            "can_have_parent",
        ]

    def get_can_create(self, obj: GroupType):
        user = self.context.get("request").user
        return user.is_authenticated and (obj.can_create or user.is_superuser)


class GroupPreviewSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    sub_category = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "name",
            "short_name",
            "slug",
            "url",
            "icon",
            "id",
            "category",
            "sub_category",
        ]
        read_only_fields = [
            "name",
            "short_name",
            "slug",
            "url",
            "icon",
            "category",
        ]

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_category(self, obj: Group) -> str:
        return obj.get_category()

    def get_sub_category(self, obj: Group) -> str:
        return obj.get_sub_category()


class GroupSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()
    is_member = serializers.SerializerMethodField()
    group_type = GroupTypeSerializer(read_only=True)
    parent = GroupPreviewSerializer(read_only=True)
    category = serializers.SerializerMethodField()
    sub_category = serializers.SerializerMethodField()
    social_links = SocialLinkSerializer(many=True)

    class Meta:
        model = Group
        exclude = [
            "members",
            "subscribers",
            "priority",
        ]
        read_only_fields = [
            "group_type",
            "parent",
            "url",
            "category",
            "sub_category",
            "parent",
        ]

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_is_admin(self, obj: Group) -> bool:
        return obj.is_admin(self.context["request"].user)

    def get_is_subscribed(self, obj: Group) -> bool:
        return obj.is_subscribed(self.context["request"].user)

    def get_is_member(self, obj: Group) -> bool:
        return obj.is_member(self.context["request"].user)

    def get_category(self, obj: Group) -> str:
        return obj.get_category()

    def get_sub_category(self, obj: Group) -> str:
        return obj.get_sub_category()


class ShortMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["summary", "description", "begin_date", "end_date"]

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
        return data


class GroupWriteSerializer(serializers.ModelSerializer):
    social_links = GroupSocialLinkSerializer(many=True, read_only=True)
    _change_reason = serializers.CharField(write_only=True, required=False)

    membership = ShortMemberSerializer(required=False, write_only=True)

    class Meta:
        model = Group
        exclude = [
            "members",
            "subscribers",
            "priority",
        ]
        read_only_fields = ["group_type", "url", "tags"]

    def create(self, validated_data: dict):
        _change_reason = validated_data.pop("_change_reason", None)
        membership = validated_data.pop("membership", None)

        group = Group(**validated_data)
        if _change_reason:
            group._change_reason = _change_reason
        group.save()

        # If requested, add request user to the list of members
        user = self.context["request"].user
        if membership is not None and user and user.is_authenticated:
            Membership.objects.create(
                group=group, user=user, admin=True, **membership
            )

        return group

    def get_group_type(self) -> GroupType:
        group: Group | None = self.instance
        if group is None:
            group_type = self.context["request"].query_params.get("type")
            return GroupType.objects.get(slug=group_type)
        else:
            return group.group_type

    def validate_address(self, value: str) -> str:
        if self.get_group_type().is_map and not value:
            raise exceptions.ValidationError(
                _("This field is required for map groups.")
            )
        return value

    def validate_latitude(self, value: float) -> float:
        if self.get_group_type().is_map and not value:
            raise exceptions.ValidationError(
                _("This field is required for map groups.")
            )
        return value

    def validate_longitude(self, value: float) -> float:
        if self.get_group_type().is_map and not value:
            raise exceptions.ValidationError(
                _("This field is required for map groups.")
            )
        return value

    def validate_parent(self, parent: Group | None):
        if parent is None:
            # Nothing to validate in that case
            return parent

        group: Group | None = self.instance
        group_type = self.get_group_type()

        if group == parent:
            raise exceptions.ValidationError("Can't assign itself as a parent")

        if not group_type.can_have_parent:
            raise exceptions.ValidationError(
                "Can't assign a parent to that group"
            )

        if parent.parent is not None:
            raise exceptions.ValidationError(
                "Can't choose a subgroup as parent"
            )

        if group and len(group.children.all()) > 0:
            raise exceptions.ValidationError(
                "A group having children can't have a parent"
            )

        return parent

    def validate(self, data):
        group_type = self.get_group_type()
        # assign group_type to data so that the group is updated
        data["group_type"] = group_type

        parent: Group = data.get("parent")
        if parent and not group_type.can_have_parent:
            raise exceptions.ValidationError(
                "Can't assign parent to that group"
            )

        if parent and parent.group_type != group_type:
            raise exceptions.ValidationError(
                "Parent group type and this group type do not match"
            )

        return super().validate(data)


class MembershipSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    """Membership serializer for getting or editing objects."""

    user = StudentPreviewSerializer(read_only=True)
    group = GroupPreviewSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = [
            "id",
            "user",
            "group",
            "summary",
            "description",
            "begin_date",
            "end_date",
            "priority",
            "admin",
            "admin_request",
        ]
        read_only_fields = ["id", "user", "group", "admin_request"]
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
            "user",
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
        if not (user == data["user"] or group.is_admin(user)):
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


class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Label
        fields = ["id", "name"]


class AdminRequestFormSerializer(serializers.Serializer):
    message = serializers.CharField(
        max_length=256, source="admin_request_message"
    )


class AdminRequestValidateSerializer(serializers.Serializer):
    id = serializers.IntegerField()


class AdminRequestSerializer(serializers.ModelSerializer):
    user = StudentPreviewSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ["user", "admin", "admin_request_message", "id"]


class SubscriptionSerializer(serializers.Serializer):
    subscribe = serializers.BooleanField()


class MapGroupSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    sub_category = serializers.SerializerMethodField()
    members = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = [
            "name",
            "short_name",
            "category",
            "sub_category",
            "slug",
            "url",
            "icon",
            "id",
            "summary",
            "banner",
            "address",
            "latitude",
            "longitude",
            "members",
        ]
        read_only_fields = fields

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_category(self, obj: Group) -> str:
        return obj.get_category()

    def get_sub_category(self, obj: Group) -> str:
        return obj.get_sub_category()

    def get_members(self, obj: Group) -> str:
        from_date = timezone.now()
        serialized_data = StudentPreviewSerializer(
            User.objects.filter(
                Q(
                    membership_set__group_id=obj.id,
                    membership_set__end_date__gte=from_date,
                )
                | Q(
                    membership_set__group_id=obj.id,
                    membership_set__end_date__isnull=True,
                )
            ),
            many=True,
        ).data
        return serialized_data


class MapGroupSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "name", "icon"]


class MapGroupPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ["id", "slug", "latitude", "longitude", "name", "icon"]


class GroupHistorySerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Group.history.model
        fields = [
            "pk",
            "history_date",
            "user",
            "history_change_reason",
            "history_type",
        ]

    def get_user(self, obj):
        if obj.history_user:
            return obj.history_user.name
        else:
            return obj.history_user
