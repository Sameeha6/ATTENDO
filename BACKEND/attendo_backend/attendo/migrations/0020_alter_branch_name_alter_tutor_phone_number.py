# Generated by Django 5.1.6 on 2025-04-08 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0019_remove_faculty_user_remove_hod_user_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='branch',
            name='name',
            field=models.CharField(blank=True, default='', max_length=100),
        ),
        migrations.AlterField(
            model_name='tutor',
            name='phone_number',
            field=models.CharField(default='', max_length=15, unique=True),
        ),
    ]
