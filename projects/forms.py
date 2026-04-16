from django import forms
from .models import TeamMember


class AdminLoginForm(forms.Form):
    username = forms.CharField(max_length=150)
    password = forms.CharField(widget=forms.PasswordInput)


class TeamMemberAdminForm(forms.ModelForm):
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
