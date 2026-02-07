import logging

from django.conf import settings
from django.db import models
from django.template.loader import render_to_string
from django.urls.base import reverse
from django.utils import timezone

from discord_webhook import DiscordEmbed, DiscordWebhook
from django_ckeditor_5.fields import CKEditor5Field

from apps.account.models import User
from apps.utils.fields.image_field import CustomImageField
from apps.utils.slug import (
    SlugModel,
    get_object_from_full_slug,
    get_tuple_from_full_slug,
)

logger = logging.getLogger(__name__)


class AbstractGroup(models.Model, SlugModel):
    """Modèle abstrait servant de modèle pour tous les types de Groupes."""

    # Nom du groupe
    name = models.CharField(
        verbose_name="Nom du groupe",
        unique=True,
        max_length=100,
    )
    alt_name = models.CharField(
        verbose_name="Nom alternatif",
        max_length=100,
        blank=True,
    )

    # présentation
    logo = CustomImageField(
        verbose_name="Logo du groupe",
        blank=True,
        null=True,
        help_text="Votre logo sera affiché au format 306x306 pixels.",
        size=(500, 500),
        crop=True,
        name_from_field="name",
    )
    banniere = CustomImageField(
        verbose_name="Bannière",
        blank=True,
        null=True,
        help_text="Votre bannière sera affichée au format 1320x492 pixels.",
        size=(1320, 492),
        name_from_field="name",
    )
    summary = models.CharField("Résumé", max_length=500, blank=True)
    description = CKEditor5Field(
        verbose_name="Description du groupe",
        blank=True,
    )
    video1 = models.URLField(
        "Lien vidéo 1",
        max_length=200,
        blank=True,
    )
    video2 = models.URLField(
        "Lien vidéo 2",
        max_length=200,
        blank=True,
    )

    # paramètres techniques
    members = models.ManyToManyField(
        User,
        verbose_name="Membres du groupe",
        related_name="%(class)s_members",
        through="NamedMembership",
    )
    slug = models.SlugField(max_length=40, unique=True, blank=True)
    modified_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        # creation du slug si non-existant ou corrompu
        self.set_slug(self.name, 40)
        # enregistrement
        super().save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse(self.app + ":detail", kwargs={"slug": self.slug})

    @property
    def app(self):
        return self._meta.app_label

    @property
    def full_slug(self):
        return f"{self.app}--{self.slug}"

    @property
    def app_name(self):
        return self.model_name.title()

    @property
    def model_name(self):
        """Plural Model name, used in templates"""
        return self.__class__._meta.verbose_name_plural

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        if user.is_anonymous or not user.is_authenticated:
            return False
        if user.is_superuser:
            return True
        if self.is_member(user):
            members_list = self.members.through.objects.filter(group=self)
            my_member = members_list.filter(user=user).first()
            return my_member.admin
        return False

    def is_member(self, user: User) -> bool:
        """Indicates if a user is member."""
        if user.is_anonymous or not user.is_authenticated:
            return False
        return user in self.members.all()

    def delete(self, *args, **kwargs):
        self.logo.delete()
        self.banniere.delete()
        super().delete(*args, **kwargs)


class NamedMembership(models.Model):
    admin = models.BooleanField(default=False)
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    group = models.ForeignKey(to=AbstractGroup, on_delete=models.CASCADE)

    class Meta:
        abstract = True

    def __str__(self):
        return self.user.__str__()


class AdminRightsRequest(models.Model):
    """A model to request admin rights on a group."""

    group = models.SlugField(verbose_name="Groupe demandé.")
    user = models.ForeignKey(to=User, on_delete=models.CASCADE)
    date = models.DateField(
        verbose_name="Date de la requête",
        default=timezone.now,
    )
    reason = models.CharField(
        max_length=100,
        verbose_name="Raison de la demande",
        blank=True,
    )
    domain = models.CharField(max_length=64)

    def save(self, domain: str, *args, **kwargs):
        self.date = timezone.now()
        self.domain = domain
        super().save()
        group = get_object_from_full_slug(self.group)
        try:
            webhook = DiscordWebhook(
                url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK,
            )
            embed = DiscordEmbed(
                title=f"{self.user} demande à devenir admin de {group}",
                description=self.reason,
                color=242424,
            )
            embed.add_embed_field(
                name="Accepter",
                value=f"[Accepter]({self.accept_url})",
                inline=True,
            )
            embed.add_embed_field(
                name="Refuser",
                value=f"[Refuser]({self.deny_url})",
                inline=True,
            )
            if self.user.picture:
                embed.thumbnail = {"url": self.user.picture.url}
            webhook.add_embed(embed)
            webhook.execute()
        except Exception as e:
            logger.error(e)
        super().save()

    @property
    def accept_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        url_path = reverse(
            app + ":accept-admin-req",
            kwargs={"slug": slug, "id": self.id},
        )
        return f"https://{self.domain}{url_path}"

    @property
    def deny_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        url_path = reverse(
            app + ":deny-admin-req",
            kwargs={"slug": slug, "id": self.id},
        )
        return f"https://{self.domain}{url_path}"

    def accept(self):
        group = get_object_from_full_slug(self.group)
        if group.is_member(self.user):
            membership = group.members.through.objects.get(
                user=self.user.id,
                group=group,
            )
            membership.admin = True
            membership.save()
        else:
            group.members.through.objects.create(
                user=self.user,
                group=group,
                admin=True,
            )
        mail = render_to_string(
            "abstract_group/mail/new_admin.html",
            {"group": group, "user": self.user},
        )
        self.user.email_user(
            f"Vous êtes admin de {group}",
            mail,
            from_email=None,
            html_message=mail,
        )
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(
                f"La demande de {self.user} pour rejoindre {group} "
                "a été acceptée."
            ),
            description="",
            color=00000,
        )
        webhook.add_embed(embed)
        webhook.execute()
        self.delete()

    def deny(self):
        group = get_object_from_full_slug(self.group)
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(
                f"La demande de {self.user} pour rejoindre {group} "
                "a été refusée."
            ),
            description="",
            color=00000,
        )
        webhook.add_embed(embed)
        webhook.execute()
        self.delete()
