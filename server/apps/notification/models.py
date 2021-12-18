from django.db import models
from django.utils import timezone

from apps.utils.slug import get_object_from_full_slug
from apps.student.models import Student
from apps.group.models import Group


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
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    page = models.SlugField('Page', max_length=50)

    class Meta:
        verbose_name = "Abonnement"
        unique_together = ['student', 'page']
    
    @classmethod
    def hasSubscribed(cls, page, student):
        if cls.objects.filter(page=page, student=student).exists():
            return True
        page_object = get_object_from_full_slug(page)
        if hasattr(page_object, "owner"):
            return cls.hasSubscribed(page_object.owner, student)
        return False



class Notification(models.Model):
    """Contenu d'une notification"""
    body = models.CharField('Corps', max_length=255)
    url = models.CharField('Cible', max_length=255)
    owner = models.SlugField('Page parente', max_length=50)
    publicity = models.CharField(choices=VISIBILITY, default='Pub',
        max_length=3, verbose_name='Visibilité de la notification')
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
    receivers = models.ManyToManyField(
        Student, related_name='notification_set', through='SentNotification')

    def __str__(self):
        return f'{self.body[:20]}...'
    
    def get_logo(self):
        page = get_object_from_full_slug(self.owner)
        while not(isinstance(page, Group)):
            page = get_object_from_full_slug(page.owner)
        if hasattr(page, "logo"):
            return page.logo
        else:
            return None

    def addReveiversMember(self, owner):
        """Ajouter les membres de groupes en tant que destinataires"""
        page = get_object_from_full_slug(owner)
        if isinstance(page, Group):
            self.receivers.add(*page.members.all())
        elif hasattr(page, "owner"):
            self.addReceiversMember(page.owner)
    
    def addReceiverAdmin(self, owner):
        """Ajouter les admins de groupes en tant que destinataires"""
        page = get_object_from_full_slug(owner)
        if isinstance(page, Group):
            admins = page.members.through.objects.filter(group=page, admin=True)
            self.receivers.add(*admins.all())
        elif hasattr(page, "owner"):
            self.addReceiverAdmin(page.owner)

    def addAllUsers(self):
        """Ajouter tous les utilisateurs dans les destinataires"""
        all_users = Student.objects.all()
        self.receivers.add(*all_users)
    
    def save(self, *args, **kwargs):
        """Sauver la notif et ajouter des destinataires"""
        super().save(*args, **kwargs)
        if self.publicity == 'Pub':
            self.addAllUsers()
        elif self.publicity == 'Mem':
            self.addReveiversMember(self.owner)
            self.high_priority = True
        elif self.publicity == 'Adm':
            self.addReceiverAdmin(self.owner)
            self.high_priority = True            




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
    
    def sendPushNotification(self):
        """Send the notification to the device."""
        # pas encore de code ici
        pass
    
    def save(self, *args, **kwargs):
        """Save object and send notifications to devices if needed"""
        if (self.notification.high_priority or Subscription.hasSubscribed(self.notification.owner, self.student)):
            self.subscribed = True
            self.sendPushNotification()
        super(SentNotification, self).save(*args, **kwargs)
