from rest_framework import serializers

from .models import Housing, NamedMembershipRoommates, Roommates


class HousingSerializer(serializers.ModelSerializer):
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
    class Meta:
        model = NamedMembershipRoommates


class RoommatesGroupSerializer(serializers.ModelSerializer):
    members = RoommatesMemberSerializer(many=True)

    class Meta:
        model = Roommates
        fields = '__all__'