# Generated by Django 4.1.4 on 2023-02-28 15:15

from django.db import migrations, models
import django.db.models.deletion

def migrate_slugs_to_fk(apps, schema_editor) :
    post = apps.get_model('post', 'Post')
    group = apps.get_model('group', 'Group')
    for obj in post.objects.all() :
        group_object = group.objects.filter(slug = obj.group_slug)
        if group_object.exists() :
            obj.group = group_object.first()
        else :
            print("Club" , obj.group_slug , "non reconnu" )
            obj.group = group.objects.all().first()
            print("Club mis à défaut à " + obj.group.name)
        obj.save()

def migrate_fk_to_slugs(apps, schema_editor) :
    post = apps.get_model('post', 'Post')
    for obj in post.objects.all() :
        slug = obj.group.slug
        obj.group_slug = slug
        obj.save()
class Migration(migrations.Migration):

    dependencies = [
        ('group','0010_group_grouptype_tag_membership_label_and_more'),
        ('post', '0008_alter_post_page_suggestion_alter_post_pinned'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='group',
            field=models.ForeignKey(
                null = True,
                on_delete=django.db.models.deletion.CASCADE, 
                to='group.group', 
                verbose_name='Organisateur'),
        ),
        migrations.RunPython(migrate_slugs_to_fk, reverse_code=migrate_fk_to_slugs),
        migrations.RemoveField(
            model_name='post',
            name='group_slug',
        ),
        migrations.AlterField(
            model_name='post',
            name='group',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE, 
                to='group.group', 
                verbose_name='Organisateur'),
        ),
    ]      