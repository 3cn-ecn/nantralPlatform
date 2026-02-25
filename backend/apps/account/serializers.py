from datetime import datetime

from django.db.models import F
from django.utils import timezone
from django.utils.translation import gettext as _

from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.validators import UniqueValidator

from apps.sociallink.serializers import SocialLinkSerializer

from .models import FACULTIES, PATHS, Email, InvitationLink, User
from .utils import clean_username
from .validators import (
    django_validate_password,
    ecn_email_validator,
    validate_email,
    validate_matrix_username,
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
                Email.objects.all().annotate(email_ecn=F("email")),
                message=_(
                    "An account has already been created with this email address"
                ),
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
                message=_(
                    "An account has already been created with this email address"
                ),
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
                message=_("This username is already taken."),
            ),
            validate_matrix_username,
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
            promo=validated_data["promo"],
            faculty=validated_data["faculty"],
        )
        if "path" in validated_data:
            user.path = validated_data["path"]

        # IMPORTANT: hash password and remove password from validated_data
        user.set_password(self.validated_data.pop("password"))

        # assign to something unique in the first place
        user.username = validated_data.get("email")
        # save to generate the primary key for default username and main email
        user.save()

        user.email = user.add_email(
            validated_data["email"], request=self.context.get("request")
        )

        user.username = validated_data.get("username")

        if user.username is None:
            # create a unique username
            promo = validated_data.get("promo")
            user.username = clean_username(
                f"{user.first_name}.{user.last_name}.{promo}.{user.pk}"
            )
        # save again
        user.save()

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
            raise ValidationError(_("Invalid passsword"))

        return val


class InvitationRegisterSerializer(RegisterSerializer):
    # Don't validate ecn email
    email = serializers.EmailField(
        max_length=200,
        validators=[
            validate_email,
            UniqueValidator(
                Email.objects.all(),
                message=_(
                    "An account has already been created with this email address"
                ),
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


class EmailSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        style={"input_type": "password"}, required=False, write_only=True
    )
    is_main = serializers.BooleanField(required=False)
    is_ecn_email = serializers.BooleanField(read_only=True)

    class Meta:
        model = Email
        fields = (
            "email",
            "is_ecn_email",
            "is_valid",
            "is_visible",
            "is_main",
            "password",
            "uuid",
        )
        read_only_fields = (
            "email",
            "is_ecn_email",
            "is_valid",
            "uuid",
        )
        extra_kwargs = {"is_visible": {"required": False}}

    def validate_password(self, val):
        user: User = self.context.get("request").user
        if not user.check_password(val):
            raise ValidationError(_("Invalid passsword"))
        return val

    def validate_is_main(self, val: bool):
        if not val:
            raise ValidationError(_("This field cannot be set to false"))
        return val

    def validate(self, validated_data: dict):
        if (
            "is_main" in validated_data
            and "password" not in validated_data
            and not self.context.get("request").user.is_superuser
        ):
            raise ValidationError(
                {"password": _("Password is required to set an email as main")}
            )
        return validated_data

    def update(self, instance: Email, validated_data: dict):
        if validated_data.pop("is_main", False):
            user = instance.user
            user.email = instance
            user.save()
        return super().update(instance, validated_data)


class ShortEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()


class CreateEmailSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Email
        fields = (
            "email",
            "is_visible",
            "user",
        )
        extra_kwargs = {
            "email": {
                "validators": [
                    validate_email,
                    UniqueValidator(
                        Email.objects.all(),
                        message=_(
                            "An account has already been created with this email address"
                        ),
                    ),
                ]
            }
        }

    def validate_user(self, val: User):
        request_user = self.context.get("request").user
        if val != request_user and not request_user.is_superuser:
            raise PermissionDenied
        return val

    def create(self, validated_data: dict):
        user = validated_data.pop("user")
        return user.add_email(
            validated_data.get("email"),
            request=self.context.get("request", None),
        )


class InvitationValidSerializer(serializers.Serializer):
    uuid = serializers.UUIDField()


class EditUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "path",
            "promo",
            "faculty",
            "description",
            "picture",
        ]


class UserSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()
    expires_at = serializers.SerializerMethodField()
    social_links = SocialLinkSerializer(many=True, read_only=True)
    emails = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "promo",
            "picture",
            "faculty",
            "path",
            "url",
            "is_staff",
            "is_superuser",
            "description",
            "social_links",
            "emails",
            "username",
            "expires_at",
        ]
        read_only_fields = (
            "id",
            "url",
            "is_staff",
            "is_superuser",
            "username",
            "expires_at",
        )

    def get_url(self, obj: User) -> str:
        return obj.get_absolute_url()

    def get_expires_at(self, obj: User) -> datetime | None:
        # send expiring date only to the current user
        request_user = None
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            request_user = request.user

        if request_user != obj or not obj.invitation:
            return None
        return obj.invitation.expires_at

    def get_emails(self, obj: User) -> list[dict]:
        return ShortEmailSerializer(
            obj.emails.filter(is_visible=True), many=True
        ).data


class UserPreviewSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "url", "picture"]
        read_only = ["picture"]

    def get_name(self, obj: User) -> str:
        return obj.name

    def get_url(self, obj: User) -> str:
        return obj.get_absolute_url()
