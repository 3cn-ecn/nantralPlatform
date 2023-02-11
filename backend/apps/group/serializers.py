from django.utils.translation import gettext as _

from rest_framework import serializers, exceptions

from .models import Group, Membership, GroupType
from apps.student.serializers import SimpleStudentSerializer


class AdminFieldsMixin:
    """
    A mixin to add support for 'admin_fields': an admin field can only
    be updated by an admin of the corresponding group.
    """

    def validate_admin_fields(self, data: dict[str, any], group: Group) -> None:
        admin_fields = self.Meta.admin_fields
        if admin_fields == '__all__':
            admin_fields = self.fields
        an_admin_field_is_updated = any([
            getattr(self.instance, field) != data.get(field)
            for field in admin_fields])
        user = self.context['request'].user
        if an_admin_field_is_updated and not group.is_admin(user):
            raise exceptions.PermissionDenied(_(
                "Some fields cannot be updated by non-admins."))


class GroupTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupType
        fields = ['name', 'slug', 'place_required', 'is_year_group']


class SimpleGroupSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['name', 'slug', 'url', 'icon_url']
        read_only_fields = ['name', 'slug', 'url', 'icon_url']

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_icon_url(self, obj: Group) -> str | None:
        return obj.icon.url if obj.icon else None


class GroupSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    group_type = GroupTypeSerializer(read_only=True)
    parent = SimpleGroupSerializer(read_only=True)

    class Meta:
        model = Group
        exclude = ['members', 'subscribers', 'order', 'social_links', 'place',
                   'created_at', 'created_by', 'updated_at', 'updated_by']
        read_only_fields = ['group_type', 'parent', 'url']
        admin_fields = '__all__'

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_icon_url(self, obj: Group) -> str | None:
        return obj.icon.url if obj.icon else None

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        group: Group = data['group']
        user = self.context['request'].user
        if not (user.student == data['student'] or group.is_admin(user)):
            raise exceptions.PermissionDenied(_(
                "You can only edit a membership for yourself or for "
                "someone else inside a group where you are admin."))
        self.validate_admin_fields(data, self.instance)
        return data


class MembershipSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    """Membership serializer for getting or editing objects."""
    student = SimpleStudentSerializer(read_only=True)
    group = SimpleGroupSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'student', 'group', 'summary', 'description',
                  'begin_date', 'end_date', 'order', 'admin', 'admin_request']
        read_only_fields = ['id', 'student', 'group', 'admin_request']
        admin_fields = ['order', 'admin']

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        self.validate_admin_fields(data, self.instance.group)
        return data


class NewMembershipSerializer(AdminFieldsMixin, serializers.ModelSerializer):
    """Membership serializer for creating new objets."""

    class Meta:
        model = Membership
        fields = ['student', 'group', 'summary', 'description',
                  'begin_date', 'end_date', 'admin']
        admin_fields = ['admin']

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        group: Group = data['group']
        user = self.context['request'].user  # the user making the request
        if not (user.student == data['student'] or group.is_admin(user)):
            raise exceptions.PermissionDenied(_(
                "You can only create new membership for yourself or for "
                "someone else inside a group where you are admin."))
        if group.private and not group.is_admin(user):
            raise exceptions.PermissionDenied(_(
                "You cannot create create a new membership inside a private "
                "group if you are not admin of this group."))
        self.validate_admin_fields(data, group)
        return data
