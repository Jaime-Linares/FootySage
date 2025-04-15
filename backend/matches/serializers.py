from rest_framework import serializers
from .models import Team, Match, Competition



# Serializer for the Team model
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


# Serializer for the Competition model
class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'


# Serializer for the Match model
class MatchSerializer(serializers.ModelSerializer):
    home_team = serializers.CharField(source='home_team.name')
    away_team = serializers.CharField(source='away_team.name')
    home_team_crest_url = serializers.URLField(source='home_team.football_crest_url')
    away_team_crest_url = serializers.URLField(source='away_team.football_crest_url')
    
    class Meta:
        model = Match
        fields = '__all__'

