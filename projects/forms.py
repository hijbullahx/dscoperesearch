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
    username = forms.CharField(max_length=150, required=False)
    password = forms.CharField(widget=forms.PasswordInput, required=False)

    class Meta:
        model = TeamMember
        fields = [
            'name',
            'role',
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
        return cleaned_data
