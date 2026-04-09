from django.contrib.auth import authenticate, login
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
class AdminLoginView(APIView):
  permission_classes = [AllowAny]

  def post(self, request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
      login(request, user)
      return Response({'detail': 'Login successful'}, status=status.HTTP_200_OK)
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
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