from rest_framework import serializers
from .models import Team, Match



# Serializer for the Team model
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


# Serializer for the Match model
class MatchSerializer(serializers.ModelSerializer):
    home_team = serializers.CharField(source='home_team.name')
    away_team = serializers.CharField(source='away_team.name')
    
    class Meta:
        model = Match
        fields = '__all__'

