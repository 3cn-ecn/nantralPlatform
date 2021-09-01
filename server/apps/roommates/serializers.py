from rest_framework import serializers
from .models import Housing, NamedMembershipRoommates, Roommates
from django.db.models import Q

from django.utils import timezone


class HousingLastRoommatesSerializer(serializers.ModelSerializer):
    '''Serializer for the Housing Model to display on the map, 
       with only the last roommates.'''

    roommates = serializers.SerializerMethodField()

    class Meta:
        model = Housing
        fields = '__all__'

    def get_roommates(self, obj):
        return RoommatesSerializer(obj.current_roommates, many=False, context=self._context).data


class RoommatesMemberSerializer(serializers.ModelSerializer):
    '''Serializer for a member of roommates'''

    #student = StudentSerializer(read_only=True)
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

    class Meta:
        model = Roommates
        fields = ['name', 'begin_date', 'end_date', 'members', 'url']

    def get_members(self, obj):
        members = NamedMembershipRoommates.objects.filter(group=obj)
        return RoommatesMemberSerializer(members, many=True, context=self._context).data

    def get_url(self, obj):
        return obj.get_absolute_url


'''
class HousingSerializer(serializers.ModelSerializer):
    edit_url = serializers.HyperlinkedIdentityField(
        view_name='roommates:update', read_only=True, lookup_field='slug')
    url = serializers.HyperlinkedIdentityField(
        view_name='roommates:detail', read_only=True, lookup_field='slug')
    roommates = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Housing
        fields = '__all__'

    def get_roommates(self, obj):
        roommates = Roommates.objects.filter(housing=obj)
        return RoommatesGroupSerializer(roommates, many=True, context=self._context).data

    def get_name(self, obj):
        query = Roommates.objects.filter(housing=obj).order_by('begin_date').last()
        return query.name if query else "Coloc sans nom"


class RoommatesMemberSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)
    edit_api_url = serializers.HyperlinkedIdentityField(
        view_name='roommates_api:roommates-member', read_only=True)

    class Meta:
        model = NamedMembershipRoommates
        fields = '__all__'

    def create(self, validated_data):
        return NamedMembershipRoommates.objects.create(
            student=self.student,
            group=validated_data['group']
        )


class RoommatesGroupSerializer(serializers.ModelSerializer):
    """A serializer for the roommates group."""
    members = serializers.SerializerMethodField()
    edit_members_api_url = serializers.HyperlinkedIdentityField(
        view_name='roommates_api:roommates-members', read_only=True)
    edit_api_url = serializers.HyperlinkedIdentityField(
        view_name='roommates_api:roommates-group-edit', read_only=True)

    class Meta:
        model = Roommates
        fields = '__all__'

    def get_members(self, obj):
        members = NamedMembershipRoommates.objects.filter(group=obj.id)
        return RoommatesMemberSerializer(members, many=True, context=self._context).data

    def create(self, validated_data):
        roommates = Roommates(
            name=validated_data['name'],
            housing=validated_data['housing'],
            begin_date=validated_data['begin_date']
        )
        roommates.save()
        for member in self.members:
            NamedMembershipRoommates.objects.create(
                student=Student.objects.get(id=member['student']),
                group=roommates,
                nickname=member['nickname']
            )
        return roommates
'''
