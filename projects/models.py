from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
  title = models.CharField(max_length=200)
  description = models.TextField()
  github_link = models.URLField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title


# Team member model for admin and public display
class TeamMember(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
  name = models.CharField(max_length=100)
  role = models.CharField(max_length=100)
  position = models.PositiveIntegerField(default=999, help_text='Display order within role (lower number = first)')
  bio = models.TextField(blank=True)
  photo = models.ImageField(upload_to='team_photos/', blank=True, null=True)
  google_scholar = models.URLField(blank=True, null=True)
  github = models.URLField(blank=True, null=True)
  linkedin = models.URLField(blank=True, null=True)
  website = models.URLField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name

class PendingRegistration(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    institution_name = models.CharField(max_length=200, blank=True)
    requested_role = models.CharField(max_length=100)
    payment_reference = models.CharField(max_length=120, blank=True)
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='team_photos/', blank=True, null=True)
    google_scholar = models.URLField(blank=True, null=True)
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    username = models.CharField(max_length=150, unique=True, blank=True, null=True)
    password_hash = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.email})"