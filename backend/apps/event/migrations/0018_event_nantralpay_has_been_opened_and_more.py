# Generated by Django 4.2.20 on 2025-04-01 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0017_event_description_en_event_description_fr_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='nantralpay_has_been_opened',
            field=models.BooleanField(default=False, help_text='If true, you cannot change the items nor remove sellers.', verbose_name='NantralPay has been opened'),
        ),
        migrations.AddField(
            model_name='event',
            name='nantralpay_is_open',
            field=models.BooleanField(default=False, help_text='NantralPay is currently open for this event: Users can buy items.', verbose_name='NantralPay is open'),
        ),
    ]
