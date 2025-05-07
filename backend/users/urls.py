from django.urls import path
from .views import (CustomTokenObtainPairView, RegisterView, UserFavoriteTeamsView, LatestMatchToAnalyzePerFavoriteTeamView, UserFavoriteMatchesView,
    TopThreeMostAnalyzedMatchesView, UserProfileView, ChangePasswordView, DeleteUserView, AddFavoriteMatchView, RemoveFavoriteMatchView, SendPasswordResetEmailView,
    ResetPasswordView, IncrementTimesAnalyzedMatchView)
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
    path('users/<int:user_id>/change_password/', ChangePasswordView.as_view(), name='change_password'),
    path('users/<int:user_id>/delete/', DeleteUserView.as_view(), name='delete_user'),
    path('users/match/<int:match_id>/favorite/', AddFavoriteMatchView.as_view(), name='add_favorite_match'),
    path('users/match/<int:match_id>/favorite/remove/', RemoveFavoriteMatchView.as_view(), name='remove_favorite_match'),
    path('users/match/increment_analyzed/', IncrementTimesAnalyzedMatchView.as_view(), name='increment_times_analyzed'),
    path('password_reset/', SendPasswordResetEmailView.as_view(), name='password_reset_request'),
    path('password_reset/confirm/', ResetPasswordView.as_view(), name='password_reset_confirm'),
]
