from rest_framework import serializers
from django.templatetags.static import static

from .models import Club, NamedMembershipClub
from apps.student.serializers import StudentSerializer


class ClubSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")
    opacity = serializers.SerializerMethodField("get_opacity")

    class Meta:
        model = Club
        fields = ['name', 'logo_url', 'get_absolute_url', 'opacity']

    def get_logo_url(self, obj):
        if (obj.logo):
            return obj.logo.url
        return static('img/logo/scalable/logo.svg')

    def get_opacity(self, obj):
        if (obj.logo):
            return 1
        return 0.3


class ClubMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipClub
        fields = "__all__"
