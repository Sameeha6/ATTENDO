# Generated by Django 5.1.6 on 2025-04-06 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0017_student'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='academic_year',
            field=models.CharField(max_length=10, null=True),
        ),
    ]
