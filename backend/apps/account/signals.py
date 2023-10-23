from django.db.models.signals import pre_delete
from django.dispatch import receiver

from .models import InvitationLink, User


@receiver(pre_delete, sender=InvitationLink)
def set_inactive(sender, instance: InvitationLink, **kwargs):
    User.objects.filter(invitation=instance).update(is_active=False)
