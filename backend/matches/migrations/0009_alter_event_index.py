# Generated by Django 5.2 on 2025-04-21 10:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('matches', '0008_event_representation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='index',
            field=models.IntegerField(null=True),
        ),
    ]
