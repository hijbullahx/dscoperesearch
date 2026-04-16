from django.urls import path
from .views import project_list, AdminLoginView
from rest_framework.routers import DefaultRouter
from .views import TeamMemberViewSet, PendingRegistrationViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register(r'teammembers', TeamMemberViewSet, basename='teammember')
router.register(r'registrations', PendingRegistrationViewSet, basename='registration')

urlpatterns = [
    path('projects/', project_list),
    path('admin/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/token/', obtain_auth_token, name='api_token_auth'),
] + router.urls