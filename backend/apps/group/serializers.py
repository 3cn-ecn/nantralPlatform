from rest_framework import serializers

from .models import Group, Membership
from apps.student.serializers import StudentSerializer


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


class MembershipSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = "__all__"
