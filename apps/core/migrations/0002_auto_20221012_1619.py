# Generated by Django 3.0.7 on 2022-10-12 20:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='personal',
            name='sexo',
            field=models.CharField(choices=[('masculino', 'Masculino'), ('femenino', 'Femenino')], max_length=20),
        ),
    ]
