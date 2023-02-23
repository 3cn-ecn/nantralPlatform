# Generated by Django 4.1.7 on 2023-02-22 11:16
# flake8: noqa

from django.db import migrations
from django.utils.text import slugify
from django.utils import timezone

def forwards(apps, schema_editor):
    Administration = apps.get_model('administration', 'Administration')
    GroupType = apps.get_model('group', 'GroupType')
    Group = apps.get_model('group', 'Group')
    Label = apps.get_model('group', 'Label')
    Subscription = apps.get_model('notification', 'Subscription')
    Event = apps.get_model('event', 'Event')
    Post = apps.get_model('post', 'Post')
    SocialLink = apps.get_model('sociallink', 'SocialLink')

    gt = GroupType.objects.create(
        name="Administration",
        slug='admin',
        can_create=True)

    for ad in Administration.objects.all():
        slug = slugify(ad.name)[:40]
        if Group.objects.filter(slug=slug).exists():
            id = 1
            while Group.objects.filter(slug=f'{slug}-{id}').exists(): id += 1
            slug = f'{slug}-{id}'
        g = Group.objects.create(
            name=ad.name,
            short_name=ad.name,
            slug=slug,
            group_type=gt,
            summary=ad.summary if ad.summary else '',
            description=ad.description,
            icon=ad.logo,
            banner=ad.banniere,
            video1=ad.video1,
            video2=ad.video2,
        )
        for m in ad.namedmembershipadministration_set.all():
            g.members.add(m.student, through_defaults={
                'admin': m.admin,
                'summary': m.function,
                'begin_date': timezone.now() - timezone.timedelta(days=6*30),
                'end_date': timezone.now() + timezone.timedelta(days=6*30),
            })
        for s in Subscription.objects.filter(page=f"administration--{ad.slug}"):
            g.subscribers.add(s.student)
            s.delete()
        for e in Event.objects.filter(group_slug=f"administration--{ad.slug}"):
            e.group_slug=g.slug
            e.save()
        for p in Post.objects.filter(group_slug=f"administration--{ad.slug}"):
            p.group_slug=g.slug
            p.save()
        for s in SocialLink.objects.filter(slug=f"administration--{ad.slug}"):
            g.social_links.add(s)
    # delete all courses
    Administration.objects.all().delete()


def reverse(apps, schema_editor):
    Administration = apps.get_model('administration', 'Administration')
    GroupType = apps.get_model('group', 'GroupType')
    Group = apps.get_model('group', 'Group')
    Subscription = apps.get_model('notification', 'Subscription')
    Event = apps.get_model('event', 'Event')
    Post = apps.get_model('post', 'Post')

    for group in Group.objects.filter(group_type__slug='administration'):
        ad = Administration.objects.create(
            name=group.name,
            alt_name=group.short_name,
            summary=group.summary,
            description=group.description,
            logo=group.icon,
            banniere=group.banner,
            video1=group.video1,
            video2=group.video2,
            slug=group.slug,
        )
        for m in group.membership_set.all():
            ad.members.add(m.student, through_defaults={
                'admin': m.admin,
                'function': m.summary,
            })
        for student in group.subscribers.all():
            Subscription.objects.create(student=student, page=f"administration--{ad.slug}")
        for e in Event.objects.filter(group_slug=group.slug):
            e.group_slug=f"administration--{ad.slug}"
            e.save()
        for p in Post.objects.filter(group_slug=group.slug):
            p.group_slug=f"administration--{ad.slug}"
            p.save()
        for s in group.social_links.all():
            s.slug = f"administration--{ad.slug}"
            s.save()
    # delete all group objects
    GroupType.objects.filter(slug='administration').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('administration', '0001_initial'),
        ('club', '0002_migrate_to_group'),
        ('group', '0010_group_grouptype_tag_membership_label_and_more'),
        ('notification', '0003_alter_notification_publicity'),
        ('event', '0011_rename_baseevent_event'),
        ('post', '0005_rename_group_post_group_slug'),
        ('sociallink', '0005_alter_sociallink_label_alter_sociallink_url')
    ]

    operations = [
        migrations.RunPython(forwards, reverse),
    ]