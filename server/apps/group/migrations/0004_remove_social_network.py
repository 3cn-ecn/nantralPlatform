from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('group', '0003_auto_social_network_init'),
    ]
    operations = [
        migrations.RemoveField(
            model_name='liensocialclub',
            name='club',
        ),
        migrations.RemoveField(
            model_name='liensocialclub',
            name='reseau',
        ),
        migrations.DeleteModel(
            name='LienSocialClub',
        ),
        migrations.DeleteModel(
            name='ReseauSocial',
        ),
    ]
