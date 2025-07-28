from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from apps.student.models import FACULTIES, PATHS, Student

from .models import Email, InvitationLink, User
from .utils import clean_username
from .validators import (
    django_validate_password,
    ecn_email_validator,
    matrix_username_validator,
    validate_email,
)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=200)
    password = serializers.CharField(
        max_length=200,
        style={"input_type": "password"},
    )
    email_ecn = serializers.EmailField(
        max_length=200,
        validators=[
            validate_email,
            ecn_email_validator,
            UniqueValidator(
                Email.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            ),
        ],
        required=False,
    )

    def validate_email(self, value: str):
        return value.lower()


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(
        max_length=200,
        validators=[
            validate_email,
            ecn_email_validator,
            UniqueValidator(
                Email.objects.all(),
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
            matrix_username_validator,
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

        # IMPORTANT: hash password and remove password from validated_data
        user.set_password(self.validated_data.pop("password"))

        # assign to something unique in the first place
        user.username = validated_data.get("email")
        # save to generate the primary key
        user.save(request=self.context.get("request"))

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
                Email.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            ),
        ],
        required=True,
    )
    invitation_uuid = serializers.SlugRelatedField(
        slug_field="id",
        required=True,
        queryset=InvitationLink.objects.filter(expires_at__gt=timezone.now()),
    )

    def create(self, validated_data: dict):
        invitation_uuid = self.validated_data.pop("invitation_uuid")
        user = super().create(validated_data)
        # update invitation
        if not user.has_ecn_email():
            user.invitation = invitation_uuid
            user.save()
        return user


class ChangeEmailSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})
    email = serializers.EmailField(validators=[validate_email])

    def validate_password(self, val):
        user: User = self.context.get("request").user
        if not user.check_password(val):
            raise ValidationError(_("Mot de passe invalide"))
        return val

    def validate_email(self, val: str):
        user = self.context.get("request").user
        if Email.objects.exclude(user=user).filter(email=val).exists():
            raise serializers.ValidationError(_("Un compte à déjà été créé avec cette adresse email"))
        return val


class ShortEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class EmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        validators=[
            validate_email,
            ecn_email_validator,
            UniqueValidator(
                Email.objects.all(),
                message=_("Un compte à déjà été créé avec cette adresse email"),
            )
        ],
        required=True,
    )
    is_main = serializers.SerializerMethodField()

    class Meta:
        model = Email
        fields = ("id", "email", "is_valid", "is_ecn_email", "user", "is_main")
        read_only_fields = ("id", "is_valid", "is_ecn_email", "user", "is_main")

    def validate_email(self, val: str):
        if self.instance and val != self.instance.email:
            raise serializers.ValidationError(_("L'adresse mail ne peut pas être modifiée. Veuillez ajouter une nouvelle adresse"))
        return val

    def create(self, validated_data: dict):
        request = self.context.get("request")
        return request.user.add_email(validated_data.get("email"), request=self.context.get("request"))

    def get_is_main(self, obj: Email):
        return obj.user.email == obj.email


class InvitationValidSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()


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
            matrix_username_validator,
        ],
        required=True,
    )

    class Meta:
        model = User
        fields = ["username", "picture", "name", "has_updated_username"]

    def validate_username(self, value):
        if self.instance.has_opened_matrix and self.instance.username != value:
            raise serializers.ValidationError(_(
                "Vous ne pouvez pas modifier votre nom d'utilisateur car vous avez déjà créé votre compte matrix."
            ))
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
