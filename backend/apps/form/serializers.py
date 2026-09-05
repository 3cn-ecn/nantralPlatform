import jsonschema
from rest_framework import serializers

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
        errors = [
            f"User {user.name} has already been added"
            for user in users
            if self.context.get("form_schema").users.filter(pk=user.pk).exists()
        ]
        if len(users) == 0:
            raise serializers.ValidationError("You have not added any users")
        if len(errors) > 0:
            raise serializers.ValidationError(errors)
        return users

    def validate(self, data):
        form_schema = self.context.get("form_schema")
        if form_schema is None:
            raise serializers.ValidationError(
                "Form schema is required for validation."
            )
        return data

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

    class Meta:
        model = FormSchema
        exclude = ["users"]
        read_only_fields = ["userrole_set", "uuid"]

    def create(self, validated_data):
        form: FormSchema = super().create(validated_data)
        form.users.add(
            self.context["request"].user,
            through_defaults={"role": "owner"},
        )
        return form


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
        fields = ["data", "submitted_at", "modified_at", "user"]
        read_only_fields = ["submitted_at", "modified_at", "user"]

    def validate_data(self, data):
        form_schema = self.context.get("form_schema")
        if form_schema is None:
            raise serializers.ValidationError(
                "Form schema is required for validation."
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
        return FormAnswer.objects.create(
            form_schema=form_schema, user=user, **validated_data
        )
