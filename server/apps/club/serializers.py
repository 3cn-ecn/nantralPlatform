from rest_framework import serializers
from .models import Club
from django.templatetags.static import static


class ClubSerializer(serializers.ModelSerializer):
    get_absolute_url = serializers.ReadOnlyField()
    logo_url = serializers.SerializerMethodField("get_logo_url")

    class Meta:
        model = Club
        fields = ['name', 'logo_url', 'get_absolute_url']

    def get_logo_url(self, obj):
        if(obj.logo):
            return obj.logo.url
        return static('img/logo.svg')
