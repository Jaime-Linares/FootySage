from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User
from matches.models import Team, UserFavoriteTeam
from django.utils.translation import override


# This serializer is used to authenticate users and obtain JWT tokens
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # info extra en el token
        token['username'] = user.username
        token['email'] = user.email
        return token


# This serializer is used to register new users
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    favorite_teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name','password', 'password2', 'favorite_teams')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        favorite_teams = self.initial_data.get('favorite_teams', [])
        if not favorite_teams:
            raise serializers.ValidationError({"favorite_teams": "Debes elegir al menos un equipo favorito."})
        return attrs

    def create(self, validated_data):
        favorite_teams = validated_data.pop('favorite_teams', [])
        validated_data.pop('password2')

        user = User.objects.create_user(**validated_data)

        for team in favorite_teams:
            UserFavoriteTeam.objects.create(user=user, team=team)

        return user

