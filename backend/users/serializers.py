from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from django.utils.translation import override
from django.contrib.auth.password_validation import validate_password
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from matches.serializers import TeamSerializer
from .models import User
from matches.models import Team, UserFavoriteTeam



# This serializer is used to authenticate users and obtain JWT tokens
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # info extra en el token
        token['id'] = user.id
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
        for field in ['username', 'email', 'first_name', 'last_name', 'password', 'password2']:
            value = attrs.get(field)
            if not value or (isinstance(value, str) and value.strip() == ''):
                raise serializers.ValidationError({field: "Este campo no puede estar vacío"})
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden"})
        favorite_teams = self.initial_data.get('favorite_teams')
        if not favorite_teams or len(favorite_teams) == 0:
            raise serializers.ValidationError({"favorite_teams": "Debes seleccionar al menos un equipo favorito"})
        return attrs

    def create(self, validated_data):
        favorite_teams = validated_data.pop('favorite_teams', [])
        validated_data.pop('password2')

        user = User.objects.create_user(**validated_data)

        for team in favorite_teams:
            UserFavoriteTeam.objects.create(user=user, team=team)

        return user


# This serializer is used to serialize the user profile information
class UserProfileSerializer(serializers.ModelSerializer):
    favorite_teams = serializers.PrimaryKeyRelatedField(queryset=Team.objects.all(), many=True, write_only=True)
    favorite_teams_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'avatar_name', 'favorite_teams', 'favorite_teams_display']

    def get_favorite_teams_display(self, obj):
        teams = Team.objects.filter(userfavoriteteam__user=obj)
        return TeamSerializer(teams, many=True).data

    def validate(self, data):
        for field in ['username', 'email', 'first_name', 'last_name']:
            value = data.get(field)
            if not value or (isinstance(value, str) and value.strip() == ''):
                raise serializers.ValidationError({field: "Este campo no puede estar vacío"})
        if 'favorite_teams' not in data or not data['favorite_teams']:
            raise serializers.ValidationError({'favorite_teams': "Debes seleccionar al menos un equipo favorito"})
        return data

    def update(self, instance, validated_data):
        favorite_teams = validated_data.pop('favorite_teams', [])

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        with transaction.atomic():
            UserFavoriteTeam.objects.filter(user=instance).delete()
            for team in favorite_teams:
                UserFavoriteTeam.objects.create(user=instance, team=team)

        return instance


# This serializer is used to change the user's password
class ChangePasswordSerializer(serializers.Serializer):
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Las contraseñas nuevas no coinciden"})
        return attrs

