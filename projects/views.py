from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect, render
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import AdminLoginForm, TeamMemberAdminForm
from .models import PendingRegistration, Project, TeamMember
from .serializers import PendingRegistrationSerializer, TeamMemberSerializer


def _is_staff(user):
    return user.is_authenticated and user.is_staff


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

@api_view(['GET'])
def project_list(request):
    projects = Project.objects.all()

    data = []
    for project in projects:
        data.append({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'github_link': project.github_link,
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


def home_page(request):
    projects = Project.objects.order_by('-created_at')
    return render(request, 'web/home.html', {'projects': projects})


def projects_page(request):
    projects = Project.objects.order_by('-created_at')
    return render(request, 'web/projects.html', {'projects': projects})


def publications_page(request):
    return render(request, 'web/publications.html')


def team_page(request):
    members = TeamMember.objects.order_by('name')
    core_members = [m for m in members if 'core' in (m.role or '').lower()]
    instructors = [
        m
        for m in members
        if 'core' not in (m.role or '').lower() and 'instructor' in (m.role or '').lower()
    ]
    registered_members = [
        m
        for m in members
        if 'core' not in (m.role or '').lower() and 'instructor' not in (m.role or '').lower()
    ]
    return render(
        request,
        'web/team.html',
        {
            'members': members,
            'core_members': core_members,
            'instructors': instructors,
            'registered_members': registered_members,
        },
    )


def team_member_detail_page(request, member_id):
    member = get_object_or_404(TeamMember, id=member_id)
    return render(request, 'web/team_detail.html', {'member': member})


def admin_login_page(request):
    if request.user.is_authenticated and request.user.is_staff:
        return redirect('admin-dashboard-page')

    form = AdminLoginForm(request.POST or None)
    if request.method == 'POST' and form.is_valid():
        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        user = authenticate(request, username=username, password=password)
        if user and user.is_staff:
            login(request, user)
            return redirect('admin-dashboard-page')
        messages.error(request, 'Invalid credentials.')

    return render(request, 'web/admin_login.html', {'form': form})


def registered_member_login_page(request):
    if request.method == 'POST':
        messages.success(request, 'Registered Member login will be enabled once credentials are configured.')
    return render(
        request,
        'web/role_login.html',
        {
            'role_kicker': 'Member Access',
            'role_title': 'Sign in as Registered Member',
            'role_button': 'Log In',
        },
    )


def instructor_login_page(request):
    if request.method == 'POST':
        messages.success(request, 'Instructor login will be enabled once credentials are configured.')
    return render(
        request,
        'web/role_login.html',
        {
            'role_kicker': 'Instructor Access',
            'role_title': 'Sign in as Instructor',
            'role_button': 'Log In',
        },
    )


def core_member_login_page(request):
    if request.method == 'POST':
        messages.success(request, 'Core Member login will be enabled once credentials are configured.')
    return render(
        request,
        'web/role_login.html',
        {
            'role_kicker': 'Core Access',
            'role_title': 'Sign in as Core Member',
            'role_button': 'Log In',
        },
    )


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_logout_page(request):
    if request.method == 'POST':
        logout(request)
        return redirect('home')
    return redirect('admin-dashboard-page')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_dashboard_page(request):
    return render(request, 'web/admin_dashboard.html')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_home_manager_page(request):
    return render(request, 'web/admin_home.html')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_projects_manager_page(request):
    return render(request, 'web/admin_projects.html')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_publications_manager_page(request):
    return render(request, 'web/admin_publications.html')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_team_members_manager_page(request):
    return render(request, 'web/admin_team_members.html')


@login_required(login_url='admin-login-page')
@user_passes_test(_is_staff, login_url='admin-login-page')
def admin_team_page(request):
    members = TeamMember.objects.order_by('name')
    add_form = TeamMemberAdminForm(prefix='add', require_credentials=True)
    edit_form = None
    show_add_form = request.GET.get('add') in {'1', 'true', 'yes'}
    editing_member_id = request.GET.get('edit')

    if editing_member_id:
        editing_member = TeamMember.objects.filter(id=editing_member_id).first()
        if editing_member:
            initial = {}
            if editing_member.user:
                initial['username'] = editing_member.user.username
            edit_form = TeamMemberAdminForm(instance=editing_member, prefix='edit', initial=initial)

    if request.method == 'POST':
        action = request.POST.get('action')

        if action == 'delete':
            member_id = request.POST.get('member_id')
            member = TeamMember.objects.filter(id=member_id).first()
            if member:
                member.delete()
                messages.success(request, 'Member deleted.')
            else:
                messages.error(request, 'Member not found.')
            return redirect('admin-team-page')

        if action == 'add':
            show_add_form = True
            add_form = TeamMemberAdminForm(
                request.POST,
                request.FILES,
                prefix='add',
                require_credentials=True,
            )
            if add_form.is_valid():
                new_member = add_form.save(commit=False)
                username = add_form.cleaned_data.get('username')
                password = add_form.cleaned_data.get('password')

                if User.objects.filter(username=username).exists():
                    messages.error(request, 'Username already exists.')
                else:
                    user = User.objects.create_user(username=username, password=password)
                    new_member.user = user
                    new_member.save()
                    messages.success(request, 'Member added.')
                    return redirect('admin-team-page')

        if action == 'edit':
            member_id = request.POST.get('member_id')
            member = TeamMember.objects.filter(id=member_id).first()
            if not member:
                messages.error(request, 'Member not found.')
                return redirect('admin-team-page')

            edit_form = TeamMemberAdminForm(request.POST, request.FILES, instance=member, prefix='edit')
            editing_member_id = str(member.id)
            if edit_form.is_valid():
                updated_member = edit_form.save(commit=False)
                username = edit_form.cleaned_data.get('username')
                password = edit_form.cleaned_data.get('password')

                if username:
                    if member.user and member.user.username != username and User.objects.filter(username=username).exists():
                        messages.error(request, 'Username already exists.')
                        members = TeamMember.objects.order_by('name')
                        return render(
                            request,
                            'web/admin_team.html',
                            {
                                'members': members,
                                'add_form': add_form,
                                'edit_form': edit_form,
                                'show_add_form': show_add_form,
                                'editing_member_id': editing_member_id,
                            },
                        )

                    if member.user:
                        member.user.username = username
                        if password:
                            member.user.set_password(password)
                        member.user.save()
                    else:
                        if not password:
                            messages.error(request, 'Password is required to create a new account.')
                            members = TeamMember.objects.order_by('name')
                            return render(
                                request,
                                'web/admin_team.html',
                                {
                                    'members': members,
                                    'add_form': add_form,
                                    'edit_form': edit_form,
                                    'show_add_form': show_add_form,
                                    'editing_member_id': editing_member_id,
                                },
                            )
                        user = User.objects.create_user(username=username, password=password)
                        updated_member.user = user
                elif member.user and password:
                    member.user.set_password(password)
                    member.user.save()

                updated_member.save()
                messages.success(request, 'Member updated.')
                return redirect('admin-team-page')

    members = TeamMember.objects.order_by('name')
    return render(
        request,
        'web/admin_team.html',
        {
            'members': members,
            'add_form': add_form,
            'edit_form': edit_form,
            'show_add_form': show_add_form,
            'editing_member_id': editing_member_id,
        },
    )