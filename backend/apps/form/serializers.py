from collections import Counter

from django.utils.translation import gettext_lazy as _

import jsonschema
from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from apps.account.models import User
from apps.form.models import FormAnswer, FormSchema, UserRole


def to_ajv_error(error: jsonschema.ValidationError):
    if error.validator == "required":
        missing = error.message.split("'")[1]
        return {
            "validator": "required",
            "message": error.message,
            "absolute_path": [*error.absolute_path, missing],
            "absolute_schema_path": list(error.absolute_schema_path),
            "params": {"missingProperty": missing},
        }

    return {
        "validator": error.validator,
        "message": str(error.message),
        "absolute_path": list(error.absolute_path),
        "absolute_schema_path": list(error.absolute_schema_path),
        "params": {},
    }


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = "__all__"
        read_only_fields = ["user", "form_schema"]


class CreateRoleSerializer(serializers.ModelSerializer):
    users = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all()
    )

    class Meta:
        model = UserRole
        fields = ["role", "users"]

    def validate_users(self, users):
        counts = Counter(users)
        errors = [
            _("User {} has already been added").format(user.name)
            for user in users
            if self.context.get("form_schema").users.filter(pk=user.pk).exists()
        ] + [
            _("User {} is specified multiple times").format(user.name)
            for user, count in counts.items()
            if count > 1
        ]
        if len(users) == 0:
            raise serializers.ValidationError(_("You have not added any users"))
        if len(errors) > 0:
            raise serializers.ValidationError(errors)
        return users

    def validate_role(self, role):
        if role == "owner":
            raise serializers.ValidationError(
                _(
                    "You cannot give the owner role. Please contact an administrator"
                )
            )
        user: User | None = self.context.get("request").user
        form_schema: FormSchema | None = self.context.get("form_schema")
        if user and form_schema and not form_schema.is_admin(user):
            raise serializers.ValidationError(
                _("You have not the permission to edit this form")
            )
        return role

    def validate(self, attrs):
        form_schema = self.context.get("form_schema")
        if form_schema is None:
            raise serializers.ValidationError(
                _("You have not specified any Form Schema")
            )
        return attrs

    def create(self, validated_data):
        users = validated_data.pop("users")
        roles = [
            UserRole.objects.create(
                user=user, form_schema=self.get_form_schema(), **validated_data
            )
            for user in users
        ]
        return roles

    def get_form_schema(self):
        return self.context.get("form_schema")


class FormSchemaSerializer(serializers.ModelSerializer):
    userrole_set = RoleSerializer(many=True, read_only=True)
    is_admin = SerializerMethodField()
    can_view_answers = SerializerMethodField()
    can_view_form = SerializerMethodField()

    class Meta:
        model = FormSchema
        exclude = ["users"]
        read_only_fields = [
            "userrole_set",
            "uuid",
            "active",
            "editable",
            "public",
        ]

    def create(self, validated_data):
        form: FormSchema = super().create(validated_data)
        form.users.add(
            self.context["request"].user,
            through_defaults={"role": "owner"},
        )
        return form

    def get_is_admin(self, obj):
        return obj.is_admin(self.context["request"].user)

    def get_can_view_answers(self, obj):
        return obj.can_view_answers(self.context["request"].user)

    def get_can_view_form(self, obj):
        return obj.can_view_form(self.context["request"].user)


class FormAnswerPreviewSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = FormAnswer
        fields = ["url", "submitted_at", "user"]

    def get_url(self, obj):
        return obj.get_absolute_url()


class FormAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormAnswer
        fields = ["data", "submitted_at", "modified_at", "user", "uuid"]
        read_only_fields = ["submitted_at", "modified_at", "user", "uuid"]

    def validate_data(self, data):
        form_schema: FormSchema | None = self.context.get("form_schema")
        if form_schema is None:
            raise serializers.ValidationError(
                "You have not specified any Form Schema"
            )

        validator = jsonschema.Draft7Validator(form_schema.schema)
        if not validator.is_valid(data):
            raise serializers.ValidationError(
                list(map(to_ajv_error, validator.iter_errors(data)))
            )

        return data

    def create(self, validated_data):
        form_schema = self.context.get("form_schema")
        user = self.context.get("request").user

        if FormAnswer.objects.filter(
            form_schema=form_schema, user=user
        ).exists():
            raise serializers.ValidationError(
                _("You have already answered this form")
            )

        return FormAnswer.objects.create(
            form_schema=form_schema, user=user, **validated_data
        )
