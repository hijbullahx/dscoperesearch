from django.db import models
from django.contrib.auth.models import User

class Project(models.Model):
  title = models.CharField(max_length=200)
  description = models.TextField()
  github_link = models.URLField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title


class Publication(models.Model):
  title = models.CharField(max_length=250)
  authors = models.CharField(max_length=300, blank=True)
  summary = models.TextField(blank=True)
  publication_link = models.URLField(blank=True, null=True)
  published_at = models.DateField(blank=True, null=True)
  created_at = models.DateTimeField(auto_now_add=True)

  def __str__(self):
    return self.title


# Team member model for admin and public display
class TeamMember(models.Model):
  user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
  name = models.CharField(max_length=100)
  role = models.CharField(max_length=100)
  assigned_instructor = models.ForeignKey(
      'self',
      on_delete=models.SET_NULL,
      null=True,
      blank=True,
      related_name='assigned_students',
      limit_choices_to={'role__icontains': 'Instructor'},
  )
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


class HomePageContent(models.Model):
    hero_kicker = models.CharField(max_length=100, default='Research Lab')
    hero_title = models.CharField(max_length=200, default='DeepScope Research')
    hero_subtitle = models.TextField(default='Advancing practical AI and systems research through collaborative projects, rigorous experimentation, and open technical contributions.')
    hero_primary_label = models.CharField(max_length=80, default='View Projects')
    hero_primary_url = models.CharField(max_length=200, default='/projects/')
    hero_secondary_label = models.CharField(max_length=80, default='Join Us')
    hero_secondary_url = models.CharField(max_length=200, default='/login/registered-member/')

    about_title = models.CharField(max_length=120, default='About / Mission')
    about_intro = models.TextField(default='DeepScope Research brings together researchers, builders, and students to design practical systems with measurable impact.')
    about_mission = models.TextField(default='Our mission is to create transparent, reproducible, and useful research that bridges foundational ideas with real-world deployment.')

    research_title = models.CharField(max_length=120, default='Research Areas')
    research_areas = models.TextField(default='AI\nRobotics\nIoT\nAutonomous Systems', help_text='One item per line.')

    featured_projects_title = models.CharField(max_length=120, default='Featured Projects')
    featured_publications_title = models.CharField(max_length=120, default='Publications Preview')
    team_preview_title = models.CharField(max_length=120, default='Team Preview')
    news_title = models.CharField(max_length=120, default='News / Blog')
    cta_title = models.CharField(max_length=120, default='Join / Collaborate')
    cta_description = models.TextField(default='If you want to apply, collaborate, or explore new research ideas with us, get in touch.')
    cta_primary_label = models.CharField(max_length=80, default='Apply')
    cta_primary_url = models.CharField(max_length=200, default='/login/registered-member/')
    cta_secondary_label = models.CharField(max_length=80, default='Contact')
    cta_secondary_url = models.CharField(max_length=200, default='mailto:research@dscoperesearch.org')

    footer_contact_title = models.CharField(max_length=120, default='Contact')
    footer_email = models.EmailField(blank=True, default='research@dscoperesearch.org')
    footer_social_title = models.CharField(max_length=120, default='Social')
    footer_university_info = models.TextField(default='DeepScope Research | University Research Group')

    featured_projects = models.ManyToManyField(Project, blank=True, related_name='featured_on_home')
    featured_publications = models.ManyToManyField(Publication, blank=True, related_name='featured_on_home')
    featured_team_members = models.ManyToManyField('TeamMember', blank=True, related_name='featured_on_home')
    news_items = models.TextField(blank=True, help_text='One update per line.')
    footer_social_links = models.TextField(blank=True, help_text='One social link per line, e.g. LinkedIn https://...')

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return 'Home Page Content'

    @classmethod
    def get_solo(cls):
        instance, _ = cls.objects.get_or_create(pk=1)
        return instance

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