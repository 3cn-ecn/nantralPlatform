from rest_framework import serializers
from .models import Availabilty


class AvailabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Availabilty
        fields = '__all__'
