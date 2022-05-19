from rest_framework import serializers

from .models import NamedMembershipAdministration
from apps.student.serializers import StudentSerializer


class AdministrationMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipAdministration
        fields = "__all__"
