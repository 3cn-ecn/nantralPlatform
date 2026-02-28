"""LES SLUGS ET LES GROUPES
------------------------

->  Certaines applis sont des applis "groupes". ex : Club, Liste, Roommates
->  Pour chaque instance de modèle hérité de groupe,
    on a un slug qui sert à 2 choses :
        *   enregistrer le nom du groupe de l'url de la page du groupe
        *   référencer un groupe quelconque depuis une autre table SQL
            (ex: events, posts, liens de réseaux sociaux...)

Attention, il faut bien distinguer les propriétés suivantes des groupes :
->  .slug renvoie uniquement le nom du groupe sous forme de slug pour l'url
->  .app  renvoie le nom de l'application du groupe
->  .full_slug renvoie le texte "app--slug" qui sera enregistré dans les
    autres tables SQL (events, ...) pour pouvoir retrouver le bon modèle
    ensuite

Les fonctions ci-dessous permettent de convertir les full_slug en couple
(app, slug), et aussi de récupérer directement l'instance de groupe avec
l'un ou l'autre des paramètres.


AJOUTER UN NOUVEAU GROUPE
-------------------------

Si vous ajoutez un nouveau type de groupe, créez une appli dédiée. Déclarez
les urls avec la fonction make_group_url_patterns de apps.groups.urls, et
ajoutez ensuite ce nouveau groupe dans la liste SLUG_MODELS ci-dessous.
Il vous faudra aussi ajouter vos formulaires dans group/forms.py. Les vues sont
gérées automatiquement mais peuvent être réécrites si besoin.

"""

from importlib import import_module

from django.shortcuts import get_object_or_404
from django.utils.text import slugify

# list of models who uses slugs
# 'app_name': ['location', 'model_name']
SLUG_GROUPS = {
    "club": ["apps.club.models", "Club"],
    "liste": ["apps.liste.models", "Liste"],
    "roommates": ["apps.roommates.models", "Roommates"],
    "family": ["apps.family.models", "Family"],
    "academic": ["apps.academic.models", "Course"],
    "administration": ["apps.administration.models", "Administration"],
}
SLUG_MODELS = {
    "event": ["apps.event.models", "Event"],
    "post": ["apps.post.models", "Post"],
}
SLUG_MODELS.update(SLUG_GROUPS)


class SlugModel:
    """A class to define a method to create and update slugs"""

    def set_slug(self, text: str, max_length=50) -> None:
        if not self.slug:
            slug = slugify(text)[: max_length - 5]
            model = type(self)
            if model.objects.filter(slug=slug).exists():
                num = 1
                while model.objects.filter(slug=f"{slug}-{num}").exists():
                    num += 1
                slug = f"{slug}-{num}"
            if not slug:
                num = 1
                while model.objects.filter(slug=str(num)).exists():
                    num += 1
                slug = str(num)
            self.slug = slug


def get_model(app_name: str) -> type[SlugModel]:
    try:
        package = import_module(SLUG_MODELS[app_name][0])
        model_class = getattr(package, SLUG_MODELS[app_name][1])
        return model_class
    except KeyError:
        raise Exception(f"Unknown application : {app_name}")


def get_object_from_slug(app_name: str, slug: str) -> SlugModel:
    """Get a model object from a slug and an app."""
    try:
        Model = get_model(app_name)
        return get_object_or_404(Model, slug=slug)
    except KeyError:
        raise Exception(f"Unknown application : {app_name}")


def get_full_slug_from_slug(app: str, slug: str) -> str:
    """Get the full slug from a slug and an app."""
    return f"{app}--{slug}"


def get_app_from_full_slug(full_slug: str) -> str:
    """Get the model object app name from a full slug."""
    return full_slug.split("--", maxsplit=1)[0]


def get_slug_from_full_slug(full_slug: str) -> str:
    """Get the slug from a full slug."""
    return "--".join(full_slug.split("--")[1:])


def get_tuple_from_full_slug(full_slug: str) -> tuple[str, str]:
    """Get a tuple (app, slug) from a full slug."""
    slug_list = full_slug.split("--")
    app_name = slug_list[0]
    slug = "--".join(slug_list[1:])
    return (app_name, slug)


def get_object_from_full_slug(full_slug: str) -> SlugModel:
    """Get a model object from a full slug."""
    app_name, slug = get_tuple_from_full_slug(full_slug)
    return get_object_from_slug(app_name, slug)
