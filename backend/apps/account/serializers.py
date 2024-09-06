import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from apps.student.models import FACULTIES, PATHS, Student

from .models import InvitationLink, MatrixUsernameValidator, User
from .utils import clean_username


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
            MatrixUsernameValidator(),
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
            has_updated_username=True,  # Already had a chance to change username
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
            promo = validated_data.get("promo")
            user.username = clean_username(f"{user.first_name}.{user.last_name}.{promo}.{user.pk}")
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


class EditStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["path", "promo", "description", "picture"]


class UserSerializer(serializers.ModelSerializer):
    student = EditStudentSerializer()

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "student"]

    def update(self, obj: User, data: dict):
        student_data = data.pop("student")
        self.validated_data["student"]

        for attr, value in data.items():
            setattr(obj, attr, value)

        student_serializer = EditStudentSerializer(
            instance=obj.student, data=student_data
        )

        if student_serializer.is_valid():
            student_serializer.save()
            self.validated_data["student"]["picture"] = (
                student_serializer.data.get("picture")
            )

        return obj


class UsernameSerializer(serializers.ModelSerializer):
    picture = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    has_updated_username = serializers.BooleanField(read_only=True)

    username = serializers.CharField(
        max_length=200,
        validators=[
            UniqueValidator(
                User.objects.all(),
                message=_("Ce nom d'utilisateur est déjà pris"),
            ),
            MatrixUsernameValidator(),
        ],
        required=True,
    )

    class Meta:
        model = User
        fields = ["username", "picture", "name", "has_updated_username"]

    def validate_username(self, value):
        if self.instance.has_opened_matrix and self.instance.username != value:
            raise serializers.ValidationError("You can not change username because you created a matrix account")
        return value

    def save(self):
        self.validated_data["has_updated_username"] = True
        super().save()

    def get_picture(self, obj):
        pic = obj.student.picture
        if pic:
            return pic.url
        else:
            return None

    def get_name(self, obj):
        return obj.student.name
