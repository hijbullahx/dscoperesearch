from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project

@api_view(['GET'])
def project_list(request):
  projects = Project.objects.all()

  data = []
  for project in projects:
    data.append({
      "id": project.id,
      "title": project.title,
      "description": project.description,
      "github_link" : project.github_link,
    })

  return Response(data)