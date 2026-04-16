from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from projects import views as project_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('projects.urls')),
    path('', project_views.home_page, name='home'),
    path('projects/', project_views.projects_page, name='projects-page'),
    path('publications/', project_views.publications_page, name='publications-page'),
    path('team/', project_views.team_page, name='team-page'),
    path('team/<int:member_id>/', project_views.team_member_detail_page, name='team-member-detail-page'),
    path('login/registered-member/', project_views.registered_member_login_page, name='registered-member-login-page'),
    path('login/instructor/', project_views.instructor_login_page, name='instructor-login-page'),
    path('login/core-member/', project_views.core_member_login_page, name='core-member-login-page'),
    path('dashboard/', project_views.member_dashboard_page, name='member-dashboard-page'),
    path('member/home/', project_views.registered_member_home_page, name='registered-member-home-page'),
    path('instructor/home/', project_views.instructor_home_page, name='instructor-home-page'),
    path('core-member/home/', project_views.core_member_home_page, name='core-member-home-page'),
    path('member/logout/', project_views.member_logout_page, name='member-logout-page'),
    path('admin-panel/login/', project_views.admin_login_page, name='admin-login-page'),
    path('admin-panel/logout/', project_views.admin_logout_page, name='admin-logout-page'),
    path('admin-panel/', project_views.admin_dashboard_page, name='admin-dashboard-page'),
    path('admin-panel/home/', project_views.admin_home_manager_page, name='admin-home-manager-page'),
    path('admin-panel/projects/', project_views.admin_projects_manager_page, name='admin-projects-manager-page'),
    path('admin-panel/publications/', project_views.admin_publications_manager_page, name='admin-publications-manager-page'),
    path('admin-panel/team-members/', project_views.admin_team_members_manager_page, name='admin-team-members-manager-page'),
    path('admin-panel/team/', project_views.admin_team_page, name='admin-team-page'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
