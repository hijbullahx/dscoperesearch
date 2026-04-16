from django.contrib import admin
from .models import PendingRegistration, Project, TeamMember

admin.site.register(Project)
admin.site.register(TeamMember)
admin.site.register(PendingRegistration)