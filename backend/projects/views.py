from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Project
from rest_framework import viewsets
from .models import TeamMember
from .serializers import TeamMemberSerializer

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

class TeamMemberViewSet(viewsets.ModelViewSet):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer