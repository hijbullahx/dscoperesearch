from django import forms
from django.contrib.auth.models import User
from .models import HomePageContent, PendingRegistration, Publication, Project, TeamMember


class AdminLoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)


class TeamMemberAdminForm(forms.ModelForm):
    ROLE_CHOICES = [
        ('Student/Register Member', 'Student/Register Member'),
        ('Instructor', 'Instructor'),
        ('Core Member', 'Core Member'),
    ]

    role = forms.ChoiceField(choices=ROLE_CHOICES, required=True)
    position = forms.IntegerField(required=True, min_value=1, help_text='Position within the role (must be positive integer)')
    username = forms.CharField(max_length=150, required=False)
    password = forms.CharField(widget=forms.PasswordInput, required=False)

    class Meta:
        model = TeamMember
        fields = [
            'name',
            'role',
            'position',
            'bio',
            'photo',
            'google_scholar',
            'github',
            'linkedin',
            'website',
        ]

    def __init__(self, *args, **kwargs):
        self.require_credentials = kwargs.pop('require_credentials', False)
        super().__init__(*args, **kwargs)
        self.fields['username'].required = self.require_credentials
        self.fields['password'].required = self.require_credentials

    def clean(self):
        cleaned_data = super().clean()
        if self.require_credentials:
            username = cleaned_data.get('username')
            password = cleaned_data.get('password')
            if not username:
                self.add_error('username', 'Username is required.')
            if not password:
                self.add_error('password', 'Password is required.')
        
        # Validate position is positive integer
        position = cleaned_data.get('position')
        if position is not None and position <= 0:
            self.add_error('position', 'Position must be a positive number (greater than 0).')
        
        # Check for duplicate position within the same role
        role = cleaned_data.get('role')
        if position is not None and role:
            # Exclude current instance if editing
            query = TeamMember.objects.filter(role=role, position=position)
            if self.instance.pk:
                query = query.exclude(pk=self.instance.pk)
            if query.exists():
                self.add_error('position', f'Position {position} is already assigned to another member in the {role} role.')
        
        return cleaned_data


class PendingRegistrationForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True)
    password = forms.CharField(widget=forms.PasswordInput, required=True)

    class Meta:
        model = PendingRegistration
        fields = [
            'name',
            'email',
            'institution_name',
            'bio',
            'payment_reference',
            'photo',
            'google_scholar',
            'github',
            'linkedin',
            'website',
            'username',
            'password',
        ]

    def clean_username(self):
        username = (self.cleaned_data.get('username') or '').strip()
        if User.objects.filter(username=username).exists():
            raise forms.ValidationError('This username is already in use.')
        if PendingRegistration.objects.filter(username=username).exists():
            raise forms.ValidationError('A request with this username already exists.')
        return username

    def clean_email(self):
        email = (self.cleaned_data.get('email') or '').strip().lower()
        if PendingRegistration.objects.filter(email__iexact=email).exists():
            raise forms.ValidationError('A request with this email already exists.')
        return email


class PublicationAdminForm(forms.ModelForm):
    class Meta:
        model = Publication
        fields = ['title', 'authors', 'summary', 'publication_link', 'published_at']


class HomePageContentForm(forms.ModelForm):
    featured_projects = forms.ModelMultipleChoiceField(
        queryset=Project.objects.order_by('-created_at'),
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'choice-list'}),
    )
    featured_publications = forms.ModelMultipleChoiceField(
        queryset=Publication.objects.order_by('-created_at'),
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'choice-list'}),
    )
    featured_team_members = forms.ModelMultipleChoiceField(
        queryset=TeamMember.objects.filter(role__icontains='core').order_by('position', 'name'),
        required=False,
        widget=forms.CheckboxSelectMultiple(attrs={'class': 'choice-list'}),
    )

    class Meta:
        model = HomePageContent
        fields = [
            'hero_kicker',
            'hero_title',
            'hero_subtitle',
            'hero_primary_label',
            'hero_primary_url',
            'hero_secondary_label',
            'hero_secondary_url',
            'about_title',
            'about_intro',
            'about_mission',
            'research_title',
            'research_areas',
            'featured_projects_title',
            'featured_publications_title',
            'team_preview_title',
            'news_title',
            'cta_title',
            'cta_description',
            'cta_primary_label',
            'cta_primary_url',
            'cta_secondary_label',
            'cta_secondary_url',
            'footer_contact_title',
            'footer_email',
            'footer_social_title',
            'footer_university_info',
            'news_items',
            'footer_social_links',
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields['featured_projects'].initial = self.instance.featured_projects.all()
            self.fields['featured_publications'].initial = self.instance.featured_publications.all()
            self.fields['featured_team_members'].initial = self.instance.featured_team_members.all()

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
            self.save_m2m()
        return instance

    def save_m2m(self):
        self.instance.featured_projects.set(self.cleaned_data.get('featured_projects', []))
        self.instance.featured_publications.set(self.cleaned_data.get('featured_publications', []))
        self.instance.featured_team_members.set(self.cleaned_data.get('featured_team_members', []))
