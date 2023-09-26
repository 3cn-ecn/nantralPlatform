from modeltranslation.translator import TranslationOptions, translator

from apps.event.models import Event


class EventTranslationOptions(TranslationOptions):
    fields = ("title", "description")


translator.register(Event, EventTranslationOptions)
