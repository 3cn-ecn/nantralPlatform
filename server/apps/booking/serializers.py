from django.db.models import fields
from rest_framework import serializers


class AvailabilitySerializer(serializers.ModelSerializer):
    fields = 'all'
