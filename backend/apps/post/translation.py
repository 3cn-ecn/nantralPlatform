from modeltranslation.translator import TranslationOptions, translator

from .models import Post


class PostTranslationOptions(TranslationOptions):
    fields = ("title", "description")


translator.register(Post, PostTranslationOptions)
