from modeltranslation.translator import TranslationOptions, translator

from apps.event.models import Event

from .models import AbstractPublication, Post


class AbstractPublicationTranslationOptions(TranslationOptions):
    fields = ("title", "description")


class PostTranlsationOptions(AbstractPublicationTranslationOptions):
    fields = ()


class EventTranslationOptions(AbstractPublicationTranslationOptions):
    fields = ()


translator.register(AbstractPublication, AbstractPublicationTranslationOptions)
translator.register(Post, PostTranlsationOptions)
translator.register(Event, EventTranslationOptions)
