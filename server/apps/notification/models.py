from django.db import models
from django.utils import timezone

from apps.notification.webpush import send_webpush_notification
from apps.utils.slug import get_object_from_full_slug
from apps.student.models import Student


# Fonctionnement des notifications :
# ----------------------------------
# Dans le menu notifs, on voit toutes les notifs
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
    title = models.CharField('Titre', max_length=255)
    body = models.CharField('Corps', max_length=512)
    url = models.CharField('Cible', max_length=512)
    icon_url = models.CharField(max_length=512, blank=True, null=True)
    image_url = models.CharField(max_length=512, blank=True, null=True)
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
        # if the notification is just created, then send it
        if is_created:
            # select the receivers who have subscribed and will receive the
            # notification
            if self.high_priority:
                sub_receivers = self.receivers
            else: 
                sub_receivers = self.receivers.filter(
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
                'data': {
                    'url': self.url,
                },
                'icon': self.icon_url,
                'image': self.image_url,
                'tag': self.id,
                'actions': [
                    {
                        'action': action.url,
                        'title': action.title,
                        'icon': action.icon
                    }
                    for action in self.actions
                ],
                'timestamp': self.date
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



class NotificationAction(models.Model):
    """An action for a notification."""
    notification = models.ForeignKey(Notification, 
        on_delete=models.CASCADE, related_name="actions")
    title = models.CharField('Titre', max_length=50)
    url = models.CharField('Cible', max_length=512)
    icon_url = models.CharField('Url of the icon for the action', 
        max_length=512, blank=True, null=True)

