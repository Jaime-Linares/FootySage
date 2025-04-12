from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    avatar_url = models.URLField(blank=True, null=True)
    email = models.EmailField(unique=True, blank=False, null=False)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)

    def __str__(self):
        return self.username + ", " + self.email + " (" + self.first_name + " " + self.last_name + ")"

