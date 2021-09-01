from rest_framework import serializers
from .models import Club
from django.templatetags.static import static


class ClubSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")
    opacity = serializers.SerializerMethodField("get_opacity")

    class Meta:
        model = Club
        fields = ['name', 'logo_url', 'get_absolute_url', 'opacity']

    def get_logo_url(self, obj):
        if(obj.logo):
            return obj.logo.url
        return static('img/logo.svg')

    def get_opacity(self, obj):
        if(obj.logo):
            return 1
        return 0.3
