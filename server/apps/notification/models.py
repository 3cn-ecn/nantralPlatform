from django.db import models
from django.utils import timezone

from apps.notification.utils import send_webpush_notification
from apps.utils.slug import get_object_from_full_slug
from apps.student.models import Student


# Fonctionnement des notifications :
# ----------------------------------
# Dans le menu notifs, deux onglets : 1 onglet "Abonnements", 1 onglet "Toutes"
# Seules les notifs dans l'onglet "Abonnement" sont envoyées sur l'appareil
# Par défaut, aucun abonnement donc aucune notification, sauf les prioritaires
# On s'abonne uniquement à des groupes
# Toute notification est envoyée par un groupe 

VISIBILITY = [
    ('Pub', 'Public - Visible par tous'),
    ('Mem', 'Membres uniquement - Visible uniquement par les membres du groupe'),
    ('Adm', 'Administeurs de la page')
]


class Subscription(models.Model):
    """Groupes auxquels un utilisateur est abonné."""
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="subscription_set")
    page = models.SlugField('Page', max_length=50)

    class Meta:
        verbose_name = "Abonnement"
        unique_together = ['student', 'page']
    
    @classmethod
    def hasSubscribed(cls, page, student):
        """Vérifie si un utilisateur est inscrit en remontant aux pages parentes si besoin"""
        if cls.objects.filter(page=page, student=student).exists():
            return True
        return False



class Notification(models.Model):
    """Contenu d'une notification"""
    title = models.CharField('Titre', max_length=255, default="Nantral Platform")
    body = models.CharField('Corps', max_length=512)
    url = models.CharField('Cible', max_length=255)
    icon_url = models.CharField(max_length=255, blank=True, null=True)
    image_url = models.CharField(max_length=255, blank=True, null=True)
    action1_label = models.CharField(
        'Action 1 - Label', max_length = 20, blank=True, null=True)
    action1_url = models.URLField(
        'Action 1 - Cible', max_length=255, blank=True, null=True)
    action2_label = models.CharField(
        'Action 1 - Label', max_length = 20, blank=True, null=True)
    action2_url = models.URLField(
        'Action 1 - Cible', max_length=255, blank=True, null=True)
    owner = models.SlugField('Page parente', max_length=50)
    publicity = models.CharField(choices=VISIBILITY, default='Pub',
        max_length=3, verbose_name='Visibilité de la notification')
    date = models.DateTimeField('Date de création', default=timezone.now)
    high_priority = models.BooleanField('Prioritaire', default=False)
    receivers = models.ManyToManyField(
        Student, related_name='notification_set', through='SentNotification')


    def __str__(self):
        return f'{self.title} - {self.body}'[:100]
    
    
    def save(self, *args, **kwargs):
        """Sauver la notif et ajouter des destinataires"""
        is_created = not self.id
        super().save(*args, **kwargs)
        # if the notification is just created
        if is_created:
            # get the page object
            page = get_object_from_full_slug(self.owner)
            receivers = Student.objects.none()
            # add receivers
            if self.publicity == 'Pub':
                receivers = Student.objects.all()
            elif self.publicity == 'Mem':
                self.high_priority = True
                if hasattr(page, "members"):
                    receivers = page.members.all()
            elif self.publicity == 'Adm':
                self.high_priority = True
                if hasattr(page, "members"):
                    receivers = page.members.through.objects.filter(
                        group=page, admin=True
                    )
            self.receivers.add(*receivers)
            # select the receivers who have subscribed and will receive the notif
            if self.high_priority:
                sub_receivers = receivers
            else: 
                sub_receivers = receivers.filter(
                    subscription_set__page = self.owner
                )
            SentNotification.objects.filter(
                student__in = sub_receivers,
                notification = self
            ).update(subscribed=True)
            # then send the notification to users' devices
            message = {
                'title': self.title,
                'body': self.body,
                'icon': self.icon_url,
                'image': self.image_url,
                'data': {
                    'url': self.url,
                    'action1_url': self.action1_url,
                    'action2_url': self.action2_url
                }
            }
            send_webpush_notification(sub_receivers, message)
    
    @property
    def nbTargets(self, *args, **kwargs):
        return self.sentnotification_set.count()



class SentNotification(models.Model):
    """Table des notifications envoyées à chaque utilisateur"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    seen = models.BooleanField('Vu', default=False)
    subscribed = models.BooleanField('Abonné', default=False,
        help_text="Vrai si on la montre dans les abonnements")

    class Meta:
        verbose_name = "Notification envoyée"
        verbose_name_plural = "Notifications envoyées"
        unique_together = ['student', 'notification']
    
    @property
    def date(self, *args, **kwargs):
        return self.notification.date
