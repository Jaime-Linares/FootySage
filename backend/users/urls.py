from django.urls import path
from .views import (CustomTokenObtainPairView, RegisterView, UserFavoriteTeamsView, LatestMatchToAnalyzePerFavoriteTeamView, UserFavoriteMatchesView,
    TopThreeMostAnalyzedMatchesView, UserProfileView)
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path("login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", RegisterView.as_view(), name="register"),
    path('users/<int:user_id>/favorite_teams/', UserFavoriteTeamsView.as_view(), name='favorite_teams'),
    path('users/<int:user_id>/latest_matches_for_analyze_favorite_teams/', LatestMatchToAnalyzePerFavoriteTeamView.as_view(), name='latest_matches_to_analyze_fav_teams'),
    path('users/<int:user_id>/favorite_matches/', UserFavoriteMatchesView.as_view(), name='favorite_matches'),
    path('users/<int:user_id>/top_analyzed_matches/', TopThreeMostAnalyzedMatchesView.as_view(), name='top_analyzed_matches'),
    path('users/<int:user_id>/profile/', UserProfileView.as_view(), name='user_profile'),
    path('users/<int:user_id>/profile/update/', UserProfileView.as_view(), name='update_profile'),
]
