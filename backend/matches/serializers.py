from rest_framework import serializers
from .models import Team



# Serializer for the Team model
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'

