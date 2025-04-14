from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import models
from .permissions import IsNotAuthenticated
from .models import User
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from matches.models import Team, Match, UserTimesAnalyzedMatch
from matches.serializers import TeamSerializer, MatchSerializer



# This view is used to obtain JWT tokens for authentication
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [IsNotAuthenticated]
    serializer_class = MyTokenObtainPairSerializer


# This view is used to register new users
class RegisterView(generics.CreateAPIView):
    permission_classes = [IsNotAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # create tokens for user
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        # response with tokens and user info
        return Response({
            'access': str(access),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)


# View to handle requests for favorites teams of a user
class UserFavoriteTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        teams = Team.objects.filter(userfavoriteteam__user__id=user_id)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)


# View to handle requests for the latest match to analyze of each favorite team of a user
class LatestMatchToAnalyzePerFavoriteTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        favorite_teams = Team.objects.filter(userfavoriteteam__user__id=user_id)
        latest_matches = []
        match_ids_seen = set()

        for team in favorite_teams:
            match = Match.objects.filter(
                status=Match.STATUS_FINISHED
            ).filter(
                models.Q(home_team=team) | models.Q(away_team=team)
            ).order_by('-date').first()

            if match and match.id not in match_ids_seen:
                latest_matches.append(match)
                match_ids_seen.add(match.id)

        serializer = MatchSerializer(latest_matches, many=True)
        return Response(serializer.data)


# View to handle requests for favorite matches of a user
class UserFavoriteMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        matches = Match.objects.filter(userfavoritematch__user__id=user_id)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# View to handle requests for the top three most analyzed matches of a user
class TopThreeMostAnalyzedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        top_matches = UserTimesAnalyzedMatch.objects.filter(user__id=user_id).order_by('-times_analyzed')[:3]
        matches = [entry.match for entry in top_matches]
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

