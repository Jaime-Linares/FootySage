from rest_framework import serializers
from .models import Team, Match



# Serializer for the Team model
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


# Serializer for the Match model
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

