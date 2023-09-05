import logging

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import models
from django.template.loader import render_to_string
from django.urls.base import reverse
from django.utils import timezone

from discord_webhook import DiscordEmbed, DiscordWebhook
from django_ckeditor_5.fields import CKEditor5Field

from apps.student.models import Student
from apps.utils.compress import compress_model_image
from apps.utils.slug import (
    SlugModel,
    get_object_from_full_slug,
    get_tuple_from_full_slug,
)
from apps.utils.upload import PathAndRename

logger = logging.getLogger(__name__)


path_and_rename_group = PathAndRename('groups/logo')
path_and_rename_group_banniere = PathAndRename('groups/banniere')

User = get_user_model()


class AbstractGroup(models.Model, SlugModel):
    """Modèle abstrait servant de modèle pour tous les types de Groupes."""

    # Nom du groupe
    name = models.CharField(
        verbose_name="Nom du groupe", unique=True, max_length=100
    )
    alt_name = models.CharField(
        verbose_name="Nom alternatif", max_length=100, null=True, blank=True
    )

    # présentation
    logo = models.ImageField(
        verbose_name="Logo du groupe",
        blank=True,
        null=True,
        upload_to=path_and_rename_group,
        help_text="Votre logo sera affiché au format 306x306 pixels.",
    )
    banniere = models.ImageField(
        verbose_name="Bannière",
        blank=True,
        null=True,
        upload_to=path_and_rename_group_banniere,
        help_text="Votre bannière sera affichée au format 1320x492 pixels.",
    )
    summary = models.CharField("Résumé", max_length=500, null=True, blank=True)
    description = CKEditor5Field(
        verbose_name="Description du groupe", blank=True
    )
    video1 = models.URLField(
        "Lien vidéo 1", max_length=200, null=True, blank=True
    )
    video2 = models.URLField(
        "Lien vidéo 2", max_length=200, null=True, blank=True
    )

    # paramètres techniques
    members = models.ManyToManyField(
        Student,
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

    def is_admin(self, user: User) -> bool:
        """Indicates if a user is admin."""
        if (
            user.is_anonymous
            or not user.is_authenticated
            or not hasattr(user, "student")
        ):
            return False
        student = Student.objects.filter(user=user).first()
        if user.is_superuser:
            return True
        if self.is_member(user):
            members_list = self.members.through.objects.filter(group=self)
            my_member = members_list.filter(student=student).first()
            return my_member.admin
        return False

    def is_member(self, user: User) -> bool:
        """Indicates if a user is member."""
        if (
            user.is_anonymous
            or not user.is_authenticated
            or not hasattr(user, "student")
        ):
            return False
        return user.student in self.members.all()

    def save(self, *args, **kwargs):
        # creation du slug si non-existant ou corrompu
        self.set_slug(self.name, 40)
        # compression des images
        self.logo = compress_model_image(
            self, "logo", size=(500, 500), contains=True
        )
        self.banniere = compress_model_image(
            self, "banniere", size=(1320, 492), contains=False
        )
        # enregistrement
        super(AbstractGroup, self).save(*args, **kwargs)

    @property
    def app(self):
        return self._meta.app_label

    @property
    def full_slug(self):
        return f"{self.app}--{self.slug}"

    @property
    def app_name(self):
        return self.model_name.title()

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self):
        return reverse(self.app + ":detail", kwargs={"slug": self.slug})

    @property
    def model_name(self):
        """Plural Model name, used in templates"""
        return self.__class__._meta.verbose_name_plural


class NamedMembership(models.Model):
    admin = models.BooleanField(default=False)
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    group = models.ForeignKey(to=AbstractGroup, on_delete=models.CASCADE)

    class Meta:
        abstract = True

    def __str__(self):
        return self.student.__str__()


class AdminRightsRequest(models.Model):
    """A model to request admin rights on a group."""

    group = models.SlugField(verbose_name="Groupe demandé.")
    student = models.ForeignKey(to=Student, on_delete=models.CASCADE)
    date = models.DateField(
        verbose_name="Date de la requête", default=timezone.now
    )
    reason = models.CharField(
        max_length=100, verbose_name="Raison de la demande", blank=True
    )
    domain = models.CharField(max_length=64)

    def save(self, domain: str, *args, **kwargs):
        self.date = timezone.now()
        self.domain = domain
        super(AdminRightsRequest, self).save()
        group = get_object_from_full_slug(self.group)
        try:
            webhook = DiscordWebhook(
                url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK
            )
            embed = DiscordEmbed(
                title=f"{self.student} demande à devenir admin de {group}",
                description=self.reason,
                color=242424,
            )
            embed.add_embed_field(
                name="Accepter",
                value=f"[Accepter]({self.accept_url})",
                inline=True,
            )
            embed.add_embed_field(
                name="Refuser", value=f"[Refuser]({self.deny_url})", inline=True
            )
            if self.student.picture:
                embed.thumbnail = {"url": self.student.picture.url}
            webhook.add_embed(embed)
            webhook.execute()
        except Exception as e:
            logger.error(e)
        super(AdminRightsRequest, self).save()

    @property
    def accept_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        url_path = reverse(
            app + ":accept-admin-req", kwargs={"slug": slug, "id": self.id}
        )
        return f"https://{self.domain}{url_path}"

    @property
    def deny_url(self):
        app, slug = get_tuple_from_full_slug(self.group)
        url_path = reverse(
            app + ":deny-admin-req", kwargs={"slug": slug, "id": self.id}
        )
        return f"https://{self.domain}{url_path}"

    def accept(self):
        group = get_object_from_full_slug(self.group)
        if group.is_member(self.student.user):
            membership = group.members.through.objects.get(
                student=self.student.id, group=group
            )
            membership.admin = True
            membership.save()
        else:
            group.members.through.objects.create(
                student=self.student, group=group, admin=True
            )
        mail = render_to_string(
            "abstract_group/mail/new_admin.html",
            {"group": group, "user": self.student.user},
        )
        self.student.user.email_user(
            f"Vous êtes admin de {group}",
            mail,
            from_email=None,
            html_message=mail,
        )
        webhook = DiscordWebhook(url=settings.DISCORD_ADMIN_MODERATION_WEBHOOK)
        embed = DiscordEmbed(
            title=(
                f"La demande de {self.student} pour rejoindre {group} "
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
                f"La demande de {self.student} pour rejoindre {group} "
                "a été refusée."
            ),
            description="",
            color=00000,
        )
        webhook.add_embed(embed)
        webhook.execute()
        self.delete()


# # FIXME Broken since the move of admins inside of members, nice to fix
# @receiver(m2m_changed, sender=AbstractGroup.members.through)
# def admins_changed(
#     sender, instance, action, pk_set, reverse, model, **kwargs):
#     if isinstance(instance, AbstractGroup):
#         # FIXME temporary fix because this signal shotguns m2m_changed which
#         # other can't use. To avoid this we check the instance before to make
#         # sure it's a group.
#         if action == "post_add":
#             for pk in pk_set:
#                 user = User.objects.get(pk=pk)
#                 mail = render_to_string(
#                     'abstract_group/mail/new_admin.html',
#                     {
#                         'group': instance,
#                         'user': user
#                     })
#                 user.email_user(f'Vous êtes admin de {instance}', mail,
#                                 from_email=None, html_message=mail)
#         elif action == "post_remove":
#             for pk in pk_set:
#                 user = User.objects.get(pk=pk)
#                 mail = render_to_string(
#                     'abstract_group/mail/remove_admin.html',
#                     {
#                         'group': instance,
#                         'user': user
#                     })
#                 user.email_user(
#                     f'Vous n\'êtes plus membre de {instance}',
#                     mail,
#                     from_email=None,
#                     html_message=mail)
