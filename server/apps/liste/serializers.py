from rest_framework import serializers

from .models import NamedMembershipList
from apps.student.serializers import StudentSerializer


class ListeMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipList
        fields = "__all__"
