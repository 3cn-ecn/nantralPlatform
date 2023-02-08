from rest_framework import serializers

from .models import Club, NamedMembershipClub
from apps.student.serializers import StudentSerializer


class ClubSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")
    is_current_user_admin = serializers.SerializerMethodField('is_user_admin')

    class Meta:
        model = Club
        fields = ['name', 'logo_url',
                  'get_absolute_url', "is_current_user_admin"]

    def get_logo_url(self, obj):
        if (obj.logo):
            return obj.logo.url
        return f"https://avatars.dicebear.com/api/initials/{obj.slug}.svg"

    def is_user_admin(self, obj):
        user = self.context['request'].user
        return obj.is_admin(user)


class ClubMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipClub
        fields = "__all__"
