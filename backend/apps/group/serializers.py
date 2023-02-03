from django.utils.translation import gettext as _

from rest_framework import serializers, exceptions

from .models import Group, Membership
from apps.student.serializers import SimpleStudentSerializer


class GroupSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")

    class Meta:
        model = Group
        fields = ['name', 'logo_url', 'get_absolute_url']

    def get_logo_url(self, obj):
        if (obj.logo):
            return obj.logo.url
        return f"https://avatars.dicebear.com/api/initials/{obj.slug}.svg"


class SimpleGroupSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    icon_url = serializers.SerializerMethodField()

    class Meta:
        model = Group
        fields = ['name', 'slug', 'url', 'icon_url']
        read_only_fields = ['name']

    def get_url(self, obj: Group) -> str:
        return obj.get_absolute_url()

    def get_icon_url(self, obj: Group) -> str | None:
        if obj.icon:
            return obj.icon.url
        else:
            return None


class MembershipSerializer(serializers.ModelSerializer):
    """Membership serializer for getting or editing objects."""
    student = SimpleStudentSerializer(read_only=True)
    group = SimpleGroupSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ['id', 'student', 'group', 'summary', 'description',
                  'begin_date', 'end_date', 'order', 'admin', 'admin_request']
        read_only_fields = ['admin_request']
        admin_fields = ['order', 'admin']

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        group: Group = data['group']
        user = self.context['request'].user  # the user making the request
        if not (user.student == data['student'] or group.is_admin(user)):
            raise exceptions.PermissionDenied(_(
                "You can only edit a membership for yourself or for "
                "someone else inside a group where you are admin."))
        # check if fields reserved for admins have been changed
        if (any([getattr(self.instance, field) != data.get(field)
                 for field in self.Meta.admin_fields])
                and not group.is_admin(user)):
            raise exceptions.ValidationError(_(
                "You cannot add admin rights for yourself."))
        return data


class NewMembershipSerializer(serializers.ModelSerializer):
    """Membership serializer for creating new objets."""

    class Meta:
        model = Membership
        fields = ['student', 'group', 'summary', 'description',
                  'begin_date', 'end_date', 'admin']

    def validate(self, data: dict[str, any]) -> dict[str, any]:
        group: Group = data['group']
        user = self.context['request'].user  # the user making the request
        if not (user.student == data['student'] or group.is_admin(user)):
            raise exceptions.PermissionDenied(_(
                "You can only create new membership for yourself or for "
                "someone else inside a group where you are admin."))
        if group.private and not group.is_member(user):
            raise exceptions.PermissionDenied(_(
                "You cannot create create a new membership inside a private "
                "group if you are not member of this group."))
        if data['admin'] and not group.is_admin(user):
            raise exceptions.ValidationError(_(
                "You cannot add admin rights for yourself."))
        return data
