# Generated by Django 4.2.4 on 2023-08-19 20:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='PictureModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='')),
                ('time', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='pictures', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ResultModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x1', models.IntegerField()),
                ('x2', models.IntegerField()),
                ('y1', models.IntegerField()),
                ('y2', models.IntegerField()),
                ('text', models.CharField(max_length=128)),
                ('accuracy', models.DecimalField(decimal_places=2, max_digits=2)),
                ('picture', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='results', to='main.picturemodel')),
            ],
        ),
    ]
