from rest_framework import serializers

from apps.student.models import Student
from apps.student.serializers import StudentSerializer

from .models import Housing, NamedMembershipRoommates, Roommates


class HousingSerializer(serializers.ModelSerializer):
    edit_url = serializers.HyperlinkedIdentityField(
        view_name='roommates:edit-housing', read_only=True)
    url = serializers.HyperlinkedIdentityField(
        view_name='roommates:housing-view', read_only=True)

    class Meta:
        model = Housing
        fields = '__all__'


class RoommatesHousingSerializer(serializers.ModelSerializer):
    housing = HousingSerializer(read_only=True)
    admins = serializers.StringRelatedField(many=True)
    members = serializers.StringRelatedField(many=True)

    class Meta:
        model = Roommates
        fields = '__all__'


class RoommatesMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)

    class Meta:
        model = NamedMembershipRoommates
        fields = '__all__'


class RoommatesGroupSerializer(serializers.ModelSerializer):
    members = RoommatesMemberSerializer(
        many=True, allow_null=True)

    class Meta:
        model = Roommates
        fields = '__all__'

    def create(self, validated_data):
        roommates = Roommates(
            name=validated_data['name'],
            housing=validated_data['housing'],
            begin_date=validated_data['begin_date']
        )
        roommates.save()
        for index, member in enumerate(self.members):
            NamedMembershipRoommates.objects.create(
                student=Student.objects.get(id=member['student']),
                roommates=roommates,
                nickname=validated_data['members'][index]['nickname']
            )
        return roommates
