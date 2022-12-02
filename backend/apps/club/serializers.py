from rest_framework import serializers

from .models import Club, NamedMembershipClub
from apps.student.serializers import StudentSerializer


class ClubSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")

    class Meta:
        model = Club
        fields = ['name', 'logo_url', 'get_absolute_url']

    def get_logo_url(self, obj):
        if (obj.logo):
            return obj.logo.url
        return f"https://avatars.dicebear.com/api/initials/{obj.slug}.svg"


class ClubMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipClub
        fields = "__all__"
