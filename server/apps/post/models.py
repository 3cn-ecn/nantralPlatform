from django.db import models
from django.utils import timezone

from django.shortcuts import get_object_or_404, reverse
from django.contrib.auth.models import User

from django_ckeditor_5.fields import CKEditor5Field

from apps.utils.slug import SlugModel, get_object_from_full_slug
from apps.utils.upload import PathAndRename
from apps.utils.compress import compressModelImage
from apps.group.models import Group
from apps.notification.models import Notification, NotificationAction


path_and_rename = PathAndRename("posts/pictures")

VISIBILITY = [
    ('Pub', 'Public - Visible par tous'),
    ('Mem', 'Membres uniquement - Visible uniquement par les membres du groupe')
]

COLORS = [
    ('primary', 'Bleu'),
    ('success', 'Vert'),
    ('danger', 'Rouge'),
    ('warning', 'Jaune'),
    ('secondary', 'Gris'),
    ('dark', 'Noir')
]


class AbstractPost(models.Model, SlugModel):
    publication_date = models.DateTimeField(
        verbose_name="Date de publication", default=timezone.now)
    title = models.CharField(
        max_length=200, verbose_name='Titre de l\'annonce')
    description = CKEditor5Field(
        verbose_name='Texte de l\'annonce', blank=True)
    group = models.SlugField(verbose_name='Groupe publiant l\'annonce')
    slug = models.SlugField(verbose_name='Slug de l\'annonce', 
        unique=True, null=True)
    color = models.CharField(max_length=200, verbose_name='Couleur de fond',
                             choices=COLORS, null=True, default='primary')
    publicity = models.CharField(
        max_length=200, verbose_name='Visibilité de l\'annonce', choices=VISIBILITY)
    image = models.ImageField(verbose_name="Une image, une affiche en lien ?",
                              upload_to=path_and_rename, null=True, blank=True)
    notification = models.ForeignKey(
        to=Notification, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        abstract = True

    @property
    def get_group(self) -> Group:
        return get_object_from_full_slug(self.group)

    @property
    def get_group_name(self) -> Group:
        return get_object_from_full_slug(self.group).name


    def save(self, *args, **kwargs):
        # compression des images
        self.image = compressModelImage(
            self, 'image', size=(1320, 492), contains=False)
        super(AbstractPost, self).save(*args, **kwargs)


    def can_view(self, user: User) -> bool:
        if self.publicity == VISIBILITY[0][0]:
            return True
        return self.get_group.is_member(user)
    

    def get_receivers(self, n: Notification = None): 
        """Get the list of all profiles who can see the post, and
        update high_priority field for notification"""
        # initiate
        from apps.student.models import Student
        page = self.get_group
        # if receivers are everyone
        if self.publicity == 'Pub':
            return Student.objects.all()
        # if receivers are only members
        if self.publicity == 'Mem':
            if n: n.high_priority = True
            if hasattr(page, "members"):
                return page.members.all()
        # if receivers are only administrators
        if self.publicity == 'Adm':
            if n: n.high_priority = True
            if hasattr(page, "members"):
                return page.members.through.objects.filter(
                    group=page, admin=True
                )
        # else return nobody
        return Student.objects.none()
    

    def set_notification(self, title, body):
        """Create or update the notification"""
        # create or get the notification linked to this post
        if not self.notification:
            self.notification = n = Notification()
        else: 
            n = self.notification
        # fill the fields
        n.title = title
        n.body = body
        n.url = self.get_absolute_url()
        n.sender = self.group
        n.date = self.publication_date
        if self.image: n.image_url = self.image.url
        try: n.icon_url = self.get_group.logo.url
        except Exception: pass
        # save the notification with receivers
        n.save(self.get_receivers())
        # add actions to the notification
        NotificationAction.objects.create(
            notification = n,
            title = "Ouvrir",
            url = n.url
        )
        NotificationAction.objects.create(
            notification = n,
            title = "Gérer",
            url = reverse("notification:settings")
        )




class Post(AbstractPost):

    def save(self, *args, **kwargs):
        # create the slug
        d = self.publication_date
        self.set_slug(
            f'{d.year}-{d.month}-{d.day}-{self.title}'
        )
        # save the notification
        self.set_notification(
            title = self.get_group_name, 
            body = self.title)
        # save agin the post
        super(Post, self).save(*args, **kwargs)

    # Don't make this a property, Django expects it to be a method.
    # Making it a property can cause a 500 error (see issue #553).
    def get_absolute_url(self):
        return reverse('post:detail', args=[self.slug])

    @staticmethod
    def get_post_by_slug(slug:  str):
        """Get a group from a slug."""
        return get_object_or_404(Post, slug=slug)
