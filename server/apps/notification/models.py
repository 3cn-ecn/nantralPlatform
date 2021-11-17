from django.db import models
from django.utils import timezone

from apps.utils.slug import get_object_from_full_slug
from apps.student.models import Student


# Fonctionnement des notifications :
# ----------------------------------
# Dans le menu notifs, deux onglets : 1 onglet "Abonnements", 1 onglet "Toutes"
# Seules les notifs dans l'onglet "Abonnement" sont envoyées sur l'appareil
# Par défaut, aucun abonnement donc aucune notification, sauf les prioritaires
# On s'abonne uniquement à des groupes
# Toute notification est envoyée par un groupe 


class Subscription(models.Model):
    """Groupes auxquels un utilisateur est abonné."""
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    group = models.SlugField('Groupe', max_length=50)

    class Meta:
        verbose_name = "Abonnement"
        unique_together = ['student', 'group']



class Notification(models.Model):
    """Contenu d'une notification"""
    body = models.CharField('Corps', max_length=255)
    url = models.CharField('Cible', max_length=255)
    group = models.SlugField('Groupe', max_length=50)
    receivers = models.ManyToManyField(
        Student, related_name='notification_set', through='ReceivedNotification')
    action1_label = models.CharField(
        'Action 1 - Label', max_length = 20, blank=True, null=True)
    action1_url = models.URLField(
        'Action 1 - Cible', max_length=255, blank=True, null=True)
    action2_label = models.CharField(
        'Action 1 - Label', max_length = 20, blank=True, null=True)
    action2_url = models.URLField(
        'Action 1 - Cible', max_length=255, blank=True, null=True)
    date = models.DateTimeField('Date de création', default=timezone.now)
    high_priority = models.BooleanField('Prioritaire', default=False)

    def addReveiverMemberGroup(self, *group_slugs):
        """Ajouter les membres de groupes en tant que destinataires"""
        for group_slug in group_slugs:
            group = get_object_from_full_slug(group_slug)
            self.receivers.add(group.members)
    
    def addReceiverAdminGroup(self, *group_slugs):
        """Ajouter les admins de groupes en tant que destinataires"""
        for group_slug in group_slugs:
            group = get_object_from_full_slug(group_slug)
            admins = group.members.through.objects.filter(group=group, admin=True)
            self.receivers.add(admins)

    def addAllUsers(self):
        """Ajouter tous les utilisateurs dans les destinataires"""
        all_users = Student.objects.all()
        self.receivers.add(all_users)
    
    def get_group(self):
        return get_object_from_full_slug(self.group)
    
    def __str__(self):
        return f'{self.body[:20]}...'




class ReceivedNotification(models.Model):
    """Table des notifications affichées à chaque utilisateur"""
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE)
    seen = models.BooleanField('Vu', default=False)

    class Meta:
        verbose_name = "Notification reçue"
        verbose_name_plural = "Notifications reçues"
        unique_together = ['student', 'notification']
    
    def sendPushNotification(self):
        """Send the notification to the device."""
        # pas encore de code ici
        pass
    
    def save(self, *args, **kwargs):
        """Save object and send notifications to devices if needed"""
        super().save(*args, **kwargs)
        if (self.notification.high_priority 
                or self.student.receiveAllNotifications
                or Subscription.objects.filter(
                    student=self.student,
                    group=self.notification.group).exists()
                ):
            self.sendPushNotification()
