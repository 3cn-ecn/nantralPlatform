import jsonschema
from rest_framework import serializers

from apps.form.models import FormAnswer, FormSchema


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
        model = FormSchema.users.through
        fields = ["user", "role"]


class FormSchemaSerializer(serializers.ModelSerializer):
    users = RoleSerializer(many=True, read_only=True)

    class Meta:
        model = FormSchema
        fields = "__all__"
        read_only_fields = ["users", "uuid"]


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
