import jsonschema
from rest_framework import viewsets, decorators, response, status, serializers
from rest_framework.generics import get_object_or_404

from apps.form.models import FormSchema, FormAnswer
from apps.form.serializers import FormSchemaSerializer, FormAnswerPreviewSerializer, FormAnswerSerializer


class FormViewSet(viewsets.GenericViewSet):
    serializer_class = serializers.Serializer

    @decorators.action(methods=["post"], detail=False)
    def submit(self, request):
        """
        Endpoint that receive a json form submission and validate it against the form schema using
        the jsonschema librairy.
        """
        form = request.data["form"]
        schema = request.data["schema"]
        validator = jsonschema.Draft7Validator(schema)
        if validator.is_valid(form):
            return response.Response({"success": True})
        else:
            errors = sorted(validator.iter_errors(form), key=lambda e: e.path)
            return response.Response(
                {
                    "success": False,
                    "errors": [
                        {
                            "message": error.message,
                            "path": list(error.schema_path),
                        }
                        for error in errors
                    ],
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


class FormSchemaViewSet(viewsets.ModelViewSet):
    queryset = FormSchema.objects.all()
    serializer_class = FormSchemaSerializer


class FormAnswerViewSet(viewsets.ModelViewSet):
    queryset = FormAnswer.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return FormAnswerPreviewSerializer
        return FormAnswerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        schema_uuid = self.kwargs.get("schema")
        schema = get_object_or_404(FormSchema, uuid=schema_uuid)
        context["form_schema"] = schema
        return context
