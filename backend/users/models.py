from django.contrib.auth.models import AbstractUser
from django.db import models



class User(AbstractUser):
    avatar_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.username + ", " + self.email + "(" + self.first_name + " " + self.last_name + ")"

