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
from .models import TeamMember, PendingRegistration
from .serializers import TeamMemberSerializer, PendingRegistrationSerializer
from rest_framework.decorators import action
from django.contrib.auth.models import User

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

class PendingRegistrationViewSet(viewsets.ModelViewSet):
    queryset = PendingRegistration.objects.all()
    serializer_class = PendingRegistrationSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        registration = self.get_object()
        
        # Create a new user
        username = registration.email.split('@')[0]
        password = User.objects.make_random_password()
        user = User.objects.create_user(username=username, email=registration.email, password=password)
        user.save()

        # Create a new team member
        team_member = TeamMember.objects.create(
            user=user,
            name=registration.name,
            role=registration.requested_role,
            bio=registration.bio
        )
        
        # Delete the pending registration
        registration.delete()
        
        return Response({'status': 'registration approved', 'username': username, 'password': password}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def decline(self, request, pk=None):
        registration = self.get_object()
        registration.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)