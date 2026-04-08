from django.db import models

class Project(models.Model):
  title = models.CharField(max_length=200)
  description = models.TextField()
  github_link = models.URLField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title


# Team member model for admin and public display
class TeamMember(models.Model):
  name = models.CharField(max_length=100)
  role = models.CharField(max_length=100)
  bio = models.TextField(blank=True)
  photo = models.ImageField(upload_to='team_photos/', blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.name