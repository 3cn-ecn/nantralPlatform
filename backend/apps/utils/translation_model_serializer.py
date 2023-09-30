from django.conf import settings

from rest_framework import serializers


class TranslationModelSerializer(serializers.ModelSerializer):
    """
    Add support for the 'translations_fields' Meta attribute.

    When declared, this add to the declared fields all of the translated fields
    for this field. Example:

    >>> class Meta:
    >>>     fields=['title']
    >>>     translations_fields=['title']

    The returned fields are 'title_fr', 'title_en', and 'title'
    (the current locale).

    Note that if you use:

    >>> class Meta:
    >>>     fields='__all__'
    or
    >>> class Meta:
    >>>     exclude=['other_field']

    the translated fields are already included, so you don't need to use the
    translations_fields attribute.

    ---

    You can also use 'translations_only=True' to remove the default field:

    >>> class Meta:
    >>>    fields='__all__'
    >>>    translations_fields=['title']
    >>>    translations_only=True

    It returns 'title_fr' and 'title_en', but not 'title'.
    """

    def get_field_names(self, declared_fields, info):
        fields = super().get_field_names(declared_fields, info)
        translations_fields = getattr(self.Meta, "translations_fields", [])
        translations_only = getattr(self.Meta, "translations_only", False)

        # add translations fields
        for field in translations_fields:
            if not translations_only:
                fields.append(field)
            for language in settings.LANGUAGES:
                field_translation_name = f"{field}_{language[0]}"
                fields.append(field_translation_name)

        # remove default field
        if translations_only:
            for field in translations_fields:  # noqa: WPS440
                if field in fields:
                    fields.remove(field)

        return fields
