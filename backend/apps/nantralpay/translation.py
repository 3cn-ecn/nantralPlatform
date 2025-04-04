from modeltranslation.translator import TranslationOptions, register

from .models import Item


@register(Item)
class ItemTranslationOptions(TranslationOptions):
    fields = ("name",)
