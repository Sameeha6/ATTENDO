# Generated by Django 5.1.6 on 2025-03-29 15:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0010_subject'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='subject',
            name='faculty',
        ),
        migrations.RemoveField(
            model_name='subject',
            name='branch',
        ),
        migrations.DeleteModel(
            name='Faculty',
        ),
        migrations.DeleteModel(
            name='Subject',
        ),
    ]
