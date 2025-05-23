# Generated by Django 5.1.6 on 2025-04-23 15:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0027_facultynotification'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='parent',
            name='student',
        ),
        migrations.AddField(
            model_name='parent',
            name='students',
            field=models.ManyToManyField(blank=True, related_name='parents', to='attendo.student'),
        ),
        migrations.AlterField(
            model_name='parent',
            name='academic_year',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='parent',
            name='email',
            field=models.EmailField(blank=True, max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='parent',
            name='semester',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='parent',
            name='ward_id',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='parent',
            name='ward_name',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
        migrations.DeleteModel(
            name='FacultyNotification',
        ),
    ]
