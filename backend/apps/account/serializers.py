import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from apps.student.models import FACULTIES, PATHS, Student

from .models import InvitationLink, User


def validate_ecn_email(mail: str):
    if re.search(r"@([\w\-\.]+\.)?ec-nantes.fr$", mail) is None:
        raise ValidationError(
            _(
                "Vous devez utiliser une adresse mail de Centrale Nantes "
                "finissant par ec-nantes.fr",
            ),
        )


def validate_email(mail: str):
    if "+" in mail:
        raise ValidationError(
            "L'adresse email ne doit pas contenir de caractères spéciaux",
        )


def validate_invitation(uuid: str):
    if (
        not InvitationLink.objects.filter(id=uuid).exists()
        or not InvitationLink.objects.get(id=uuid).is_valid()
    ):
        raise ValidationError(_("Le lien d'invitation est invalide"))


def django_validate_password(password):
    try:
        # validate the password against existing validators
        validate_password(password)
    except DjangoValidationError as e:
        # raise a validation error for the serializer
        raise ValidationError(e.messages)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200)
    password = serializers.CharField(
        max_length=200,
        style={"input_type": "password"},
    )

    def validate_email(self, value: str):
        return value.lower()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(
        max_length=200,
        validators=[
            validate_email,
            validate_ecn_email,
            UniqueValidator(
                User.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            ),
        ],
        required=True,
    )
    password = serializers.CharField(
        max_length=200,
        required=True,
        validators=[django_validate_password],
        style={"input_type": "password"},
    )
    first_name = serializers.CharField(max_length=200, required=True)
    last_name = serializers.CharField(max_length=200, required=True)
    username = serializers.CharField(
        max_length=200,
        validators=[
            UniqueValidator(
                User.objects.all(),
                message=_("Ce nom d'utilisateur est déjà pris"),
            ),
        ],
        required=False,
    )
    promo = serializers.IntegerField(
        min_value=1919,
        required=True,
    )
    faculty = serializers.ChoiceField(required=True, choices=FACULTIES)
    path = serializers.ChoiceField(
        choices=PATHS,
        required=False,
    )

    def validate_email(self, val: str):
        return val.lower().replace("+", "")

    def create(self, validated_data: dict):
        user = User(
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            email=validated_data["email"],
        )
        # IMPORTANT: hash password
        user.set_password(validated_data["password"])
        # little trick to remove password from validated_data
        self.validated_data.pop("password")
        # assign to something unique in the first place
        user.username = user.email
        # save to generate the primary key
        user.save()

        user.username = validated_data.get("username")

        if user.username is None:
            # create a unique username
            first_name = "".join(e for e in user.first_name if e.isalnum())
            last_name = "".join(e for e in user.last_name if e.isalnum())
            promo = validated_data.get("promo")
            user.username = f"{first_name}.{last_name}.{promo}.{user.pk}"
        # save again
        user.save()
        # add student informations
        student = Student(
            user=user,
            promo=validated_data.get("promo"),
            faculty=validated_data.get("faculty"),
            path=validated_data.get("path"),
        )
        student.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(style={"input_type": "password"})
    new_password = serializers.CharField(
        style={"input_type": "password"},
        validators=[django_validate_password],
    )

    def validate_old_password(self, val):
        """Validate that provided password is correct"""
        user: User = self.context.get("request").user
        if not user.check_password(val):
            raise ValidationError(_("Mot de passe invalide"))

        return val


class InvitationRegisterSerializer(RegisterSerializer):
    # Don't validate ecn email
    email = serializers.EmailField(
        max_length=200,
        validators=[
            validate_email,
            UniqueValidator(
                User.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            ),
        ],
        required=True,
    )
    invitation_uuid = serializers.UUIDField(
        required=True,
        validators=[validate_invitation],
    )

    def create(self, validated_data: dict):
        invitation_uuid = self.validated_data.pop("invitation_uuid", None)
        user = super().create(validated_data)
        # update invitation
        user.invitation = InvitationLink.objects.get(id=invitation_uuid)
        user.save()
        return user


class ChangeEmailSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})
    email = serializers.EmailField(
        validators=[
            validate_email,
            validate_ecn_email,
            UniqueValidator(
                User.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            ),
        ],
    )

    def validate_password(self, val):
        user: User = self.context.get("request").user
        if not user.check_password(val):
            raise ValidationError(_("Mot de passe invalide"))
        return val


class EmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class InvitationValidSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name"]
