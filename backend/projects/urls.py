from django.urls import path
from .views import project_list
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet

router = DefaultRouter()
router.register(r'teammembers', TeamMemberViewSet, basename='teammember')

urlpatterns = [
    path('projects/', project_list),
] + router.urls