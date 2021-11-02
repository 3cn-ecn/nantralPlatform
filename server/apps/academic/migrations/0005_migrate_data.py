# Generated by Django 3.2.4 on 2021-09-26 14:20

from django.db import migrations


def migrate_data(apps, schema_editor):
    # create slugs
    Course = apps.get_model('academic', 'Course')
    for course in Course.objects.all():
        course.save()
    # transfer memberships
    FollowCourse = apps.get_model('academic', 'FollowCourse')
    NamedMembershipCourse = apps.get_model('academic', 'NamedMembershipCourse')
    for follow in FollowCourse.objects.all():
        year = follow.student.promo
        if follow.when == 'EI2': year +=1
        if follow.when == 'EI3': year +=2
        if follow.when == 'M2': year +=1
        NamedMembershipCourse.objects.create(
            group = follow.course,
            student = follow.student,
            year = year,
        )


class Migration(migrations.Migration):

    dependencies = [
        ('academic', '0004_auto_20210926_1547'),
    ]

    operations = [
        migrations.RunPython(migrate_data),
    ]
