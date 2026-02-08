from django.db import transaction
from django.db.models import Q

from rest_framework import exceptions, serializers

from apps.account.models import User
from apps.family.utils import scholar_year

from .models import (
    MAX_2APLUS_PER_FAMILY,
    MIN_2APLUS_PER_FAMILY,
    MembershipFamily,
)


class FamilyMembersSerializer(serializers.Serializer):
    student0 = serializers.IntegerField(allow_null=True)
    student1 = serializers.IntegerField(allow_null=True)
    student2 = serializers.IntegerField(allow_null=True)
    student3 = serializers.IntegerField(allow_null=True)
    student4 = serializers.IntegerField(allow_null=True)
    student5 = serializers.IntegerField(allow_null=True)
    student6 = serializers.IntegerField(allow_null=True)
    student7 = serializers.IntegerField(allow_null=True)

    def save(self):
        previous_members = MembershipFamily.objects.filter(
            group=self.context.get("family"), role="2A+"
        ).all()
        previous_members_pks = [member.user.pk for member in previous_members]
        new_members = list(self.validated_data.values())

        with transaction.atomic():
            for member in previous_members:
                if member.user.pk not in new_members:
                    member.delete()

            for member in new_members:
                if member and member not in previous_members_pks:
                    MembershipFamily.objects.create(
                        user=User.objects.get(id=member),
                        role="2A+",
                        admin=True,
                        group=self.context.get("family"),
                    )

    def validate(self, attrs: dict):
        validated_data: dict = super().validate(attrs)
        # non empty ids
        values = [value for value in validated_data.values() if value]
        unique_values = set(values)

        if len(unique_values) != len(values):
            raise exceptions.ValidationError("Un membre a été ajouté 2 fois")

        if (
            len(values) < MIN_2APLUS_PER_FAMILY
            or len(values) > MAX_2APLUS_PER_FAMILY
        ):
            raise exceptions.ValidationError(
                "Erreur : une famille doit avoir minimum 3 membres \
                    et maximum 8 membres"
            )

        return validated_data

    def validate_student0(self, val):
        return self.validate_student(val)

    def validate_student1(self, val):
        return self.validate_student(val)

    def validate_student2(self, val):
        return self.validate_student(val)

    def validate_student3(self, val):
        return self.validate_student(val)

    def validate_student4(self, val):
        return self.validate_student(val)

    def validate_student5(self, val):
        return self.validate_student(val)

    def validate_student6(self, val):
        return self.validate_student(val)

    def validate_student7(self, val):
        return self.validate_student(val)

    def validate_student(self, val: int | None):
        if val is None:
            return val

        student = User.objects.filter(
            Q(id=val) & Q(promo__lt=scholar_year())
        ).first()
        if student is None:
            raise exceptions.ValidationError(
                "L'id ne correspond pas à un étudiant valide (pas un EI2+)"
            )

        others_family = student.family_set.filter(year=scholar_year()).exclude(
            pk=self.context.get("family").pk
        )

        if len(others_family) > 0:
            raise exceptions.ValidationError(
                "Cet étudiant fait déjà parti d'une autre famille"
            )

        return val
