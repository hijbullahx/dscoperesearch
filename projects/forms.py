from django import forms
from .models import TeamMember


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
