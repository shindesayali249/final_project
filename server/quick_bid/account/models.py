from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Gender choices
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other')
    ]

    # Fields for the User model
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    profile_pic = models.ImageField(upload_to='profile_pic/')
    address = models.TextField()
    pincode = models.CharField(max_length=6)
    city = models.CharField(max_length=20)
    contact = models.CharField(max_length=12)


class Otp(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=4)