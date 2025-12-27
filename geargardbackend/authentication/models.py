from django.db import models
from django.contrib.auth.models import AbstractUser


GENDER_CHOICES = (
    ("male", "Male"),
    ("female", "Female"),
    ("other", "Other"),
)


class User(AbstractUser):
    """
    Custom User model for GearGuard
    """

    # Override email to make it important
    email = models.EmailField(unique=True)

    # Extra fields required by you
    age = models.PositiveIntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=10, choices=GENDER_CHOICES, null=True, blank=True
    )
    address = models.TextField(null=True, blank=True)

    designation = models.CharField(max_length=100, null=True, blank=True)
    department = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return self.email
