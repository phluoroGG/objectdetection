from django.contrib.auth.models import User
from django.db import models


class PictureModel(models.Model):
    image = models.ImageField(upload_to='uploads/')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pictures', null=True)
    time = models.DateTimeField(auto_now_add=True)
    color = models.CharField(max_length=6)


class ResultModel(models.Model):
    picture = models.ForeignKey(PictureModel, on_delete=models.CASCADE, related_name='results')
    origin_x = models.IntegerField()
    origin_y = models.IntegerField()
    width = models.IntegerField()
    height = models.IntegerField()
    category = models.CharField(max_length=128)
    score = models.DecimalField(max_digits=9, decimal_places=8)
