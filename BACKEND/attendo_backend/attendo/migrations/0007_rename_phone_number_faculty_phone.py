# Generated by Django 5.1.6 on 2025-03-29 07:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0006_faculty'),
    ]

    operations = [
        migrations.RenameField(
            model_name='faculty',
            old_name='phone_number',
            new_name='phone',
        ),
    ]
