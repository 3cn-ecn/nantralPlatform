# Generated by Django 4.1.7 on 2023-02-21 10:05
# flake8: noqa

from django.db import migrations
from django.utils.text import slugify


def forwards(apps, schema_editor):
    Liste = apps.get_model("liste", "Liste")
    BDX = apps.get_model("club", "BDX")
    GroupType = apps.get_model("group", "GroupType")
    Group = apps.get_model("group", "Group")
    Label = apps.get_model("group", "Label")
    Subscription = apps.get_model("notification", "Subscription")
    Event = apps.get_model("event", "Event")
    Post = apps.get_model("post", "Post")
    SocialLink = apps.get_model("sociallink", "SocialLink")

    gt = GroupType.objects.create(
        name="Listes BDX",
        slug="liste",
        no_membership_dates=True,
        sort_fields="-creation_year,-label__priority,label__name,short_name",
        category_expr='f"Campagnes {group.creation_year}-{group.creation_year + 1}" if group.creation_year else "Autres"',
        sub_category_expr="group.label",
        can_create=True,
    )
    labels = {}
    for bdx in BDX.objects.all():
        labels[bdx.id] = Label.objects.create(
            name=bdx.name, priority=bdx.order, group_type=gt
        )

    for liste in Liste.objects.all():
        slug = slugify(liste.name)[:40]
        if Group.objects.filter(slug=slug).exists():
            id = 1
            while Group.objects.filter(slug=f"{slug}-{id}").exists():
                id += 1
            slug = f"{slug}-{id}"
        g = Group.objects.create(
            name=liste.name,
            short_name=liste.name,
            slug=slug,
            group_type=gt,
            summary=liste.summary if liste.summary else "",
            description=liste.description,
            icon=liste.logo,
            banner=liste.banniere,
            video1=liste.video1,
            video2=liste.video2,
            label=labels[liste.liste_type.id] if liste.liste_type else None,
            creation_year=liste.year - 1,
        )
        for m in liste.namedmembershiplist_set.all():
            g.members.add(
                m.student,
                through_defaults={
                    "admin": m.admin,
                    "summary": m.function[:50],
                    "description": m.function if len(m.function) > 50 else "",
                },
            )
        for s in Subscription.objects.filter(page=f"liste--{liste.slug}"):
            g.subscribers.add(s.student)
            s.delete()
        for e in Event.objects.filter(group_slug=f"liste--{liste.slug}"):
            e.group_slug = g.slug
            e.save()
        for p in Post.objects.filter(group_slug=f"liste--{liste.slug}"):
            p.group_slug = g.slug
            p.save()
        for s in SocialLink.objects.filter(slug=f"liste--{liste.slug}"):
            g.social_links.add(s)
    # delete all listes
    Liste.objects.all().delete()


def reverse(apps, schema_editor):
    Liste = apps.get_model("liste", "Liste")
    BDX = apps.get_model("club", "BDX")
    GroupType = apps.get_model("group", "GroupType")
    Group = apps.get_model("group", "Group")
    Subscription = apps.get_model("notification", "Subscription")
    Event = apps.get_model("event", "Event")
    Post = apps.get_model("post", "Post")

    bdx = {}
    gt = GroupType.objects.filter(slug="liste").first()
    if gt:
        for label in gt.label_set.all():
            b = BDX.objects.filter(name=label.name).first()
            if b:
                bdx[label.id] = b
    for group in Group.objects.filter(group_type__slug="liste"):
        liste = Liste.objects.create(
            name=group.name,
            alt_name=group.short_name,
            liste_type=bdx.get(group.label.id, None) if group.label else None,
            summary=group.summary,
            description=group.description,
            logo=group.icon,
            banniere=group.banner,
            video1=group.video1,
            video2=group.video2,
            slug=group.slug,
            year=group.creation_year + 1,
        )
        for m in group.membership_set.all():
            liste.members.add(
                m.student,
                through_defaults={
                    "admin": m.admin,
                    "function": m.summary,
                },
            )
        for student in group.subscribers.all():
            Subscription.objects.create(
                student=student, page=f"liste--{liste.slug}"
            )
        for e in Event.objects.filter(group_slug=group.slug):
            e.group_slug = f"liste--{liste.slug}"
            e.save()
        for p in Post.objects.filter(group_slug=group.slug):
            p.group_slug = f"liste--{liste.slug}"
            p.save()
        for s in group.social_links.all():
            s.slug = f"liste--{liste.slug}"
            s.save()
    # delete all group objects
    GroupType.objects.filter(slug="liste").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("liste", "0014_alter_liste_options"),
        ("club", "0001_alter_namedmembershipclub_date_begin"),
        ("group", "0010_group_grouptype_tag_membership_label_and_more"),
        ("notification", "0003_alter_notification_publicity"),
        ("event", "0011_rename_baseevent_event"),
        ("post", "0005_rename_group_post_group_slug"),
        ("sociallink", "0005_alter_sociallink_label_alter_sociallink_url"),
    ]

    operations = [
        migrations.RunPython(forwards, reverse),
    ]
