# Generated by Django 4.2 on 2023-05-20 13:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookmark', '0003_alter_bookmark_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bookmark',
            name='explanation',
            field=models.CharField(max_length=1000),
        ),
    ]
