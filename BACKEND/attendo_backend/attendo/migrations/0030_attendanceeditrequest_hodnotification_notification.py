# Generated by Django 5.1.6 on 2025-04-25 02:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('attendo', '0029_attendance'),
    ]

    operations = [
        migrations.CreateModel(
            name='AttendanceEditRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('hour', models.CharField(max_length=10)),
                ('new_status', models.CharField(choices=[('Present', 'Present'), ('Absent', 'Absent')], max_length=10)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Approved', 'Approved'), ('Rejected', 'Rejected')], default='Pending', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('branch', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendo.branch')),
                ('hod', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendo.hod')),
                ('requested_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='edit_requests', to='attendo.faculty')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendo.student')),
            ],
        ),
        migrations.CreateModel(
            name='HodNotification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('is_read', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='attendo.hod')),
                ('related_request', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='attendo.attendanceeditrequest')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('message', models.TextField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('parent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='attendo.parent')),
            ],
        ),
    ]
