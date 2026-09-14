from modeltranslation.translator import TranslationOptions, register

from .models import Event, SportEvent


@register(SportEvent)
class SportEventTranslationOptions(TranslationOptions):
    fields = ("description",)


@register(Event)
class EventTranslationOptions(TranslationOptions):
    fields = ("title", "description")
