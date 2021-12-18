from rest_framework import serializers

from .models import Subscription
from apps.student.serializers import StudentSerializer


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['page', 'student']
