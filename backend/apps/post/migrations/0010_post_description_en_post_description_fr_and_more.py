# Generated by Django 4.2.5 on 2023-09-26 14:02

from django.db import migrations, models
import django_ckeditor_5.fields


def copy_data(apps, schema_editor):
    Post = apps.get_model('post', 'post')
    for obj in Post.objects.all():
        if not obj.title_fr:
            obj.title_fr = obj.title
            obj.save()
        if not obj.description_fr:
            obj.description_fr = obj.description
            obj.save()


def reverse_copy_data(apps, schema_editor):
    return
    

class Migration(migrations.Migration):

    dependencies = [
        ("post", "0009_alter_post_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="description_en",
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True, null=True, verbose_name="Description"
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="description_fr",
            field=django_ckeditor_5.fields.CKEditor5Field(
                blank=True, null=True, verbose_name="Description"
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="title_en",
            field=models.CharField(
                max_length=200, null=True, verbose_name="Title"
            ),
        ),
        migrations.AddField(
            model_name="post",
            name="title_fr",
            field=models.CharField(
                max_length=200, null=True, verbose_name="Title"
            ),
        ),
        migrations.RunPython(copy_data, reverse_code=reverse_copy_data),
    ]
