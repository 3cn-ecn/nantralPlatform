from modeltranslation.translator import TranslationOptions, register

from .models import Group, Thematic


@register(Group)
class GroupTranslationOptions(TranslationOptions):
    fields = ("summary", "description")


@register(Thematic)
class ThematicTranslationOptions(TranslationOptions):
    fields = ("name",)
