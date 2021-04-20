from rest_framework import serializers

from .models import Housing, Roommates

class  HousingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Housing
        fields = '__all__'