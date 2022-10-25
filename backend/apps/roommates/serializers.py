from rest_framework import serializers
from .models import Housing, NamedMembershipRoommates, Roommates
from apps.student.models import Student
from apps.student.serializers import StudentSerializer


class HousingLastRoommatesSerializer(serializers.ModelSerializer):
    '''Serializer for the Housing Model to display on the map,
       with only the last roommates.'''

    roommates = serializers.SerializerMethodField()

    class Meta:
        model = Housing
        fields = '__all__'

    def get_roommates(self, obj):
        return RoommatesSerializer(
            obj.current_roommates, many=False, context=self._context).data


class RoommatesMemberSerializer(serializers.ModelSerializer):
    '''Serializer for a member of roommates'''

    name = serializers.SerializerMethodField()

    class Meta:
        model = NamedMembershipRoommates
        fields = ['nickname', 'name']

    def get_name(self, obj):
        return obj.student.name


class RoommatesSerializer(serializers.ModelSerializer):
    '''Serializer for roommates'''

    # RoommatesMemberSerializer(read_only=True, many=True)
    members = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    colocathlon_participants = StudentSerializer(many=True)

    class Meta:
        model = Roommates
        fields = [
            'name',
            'begin_date',
            'end_date',
            'members',
            'url',
            'colocathlon_agree',
            'colocathlon_quota',
            'colocathlon_hours',
            'colocathlon_activities',
            'colocathlon_participants']

    def get_members(self, obj):
        members = NamedMembershipRoommates.objects.filter(group=obj)
        return RoommatesMemberSerializer(
            members, many=True, context=self._context).data

    def get_url(self, obj):
        return obj.get_absolute_url()
