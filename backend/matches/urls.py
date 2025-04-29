from django.urls import path
from .views import TeamListView, UpcomingMatchesView, FilteredCompetitionsView, MatchSeasonsView, MatchGenresView, FilteredMatchesView, MatchDetailView


urlpatterns = [
    path("match_detail/", MatchDetailView.as_view(), name="match_detail"),
    path("teams/", TeamListView.as_view(), name="team_list"),
    path("upcoming_matches/", UpcomingMatchesView.as_view(), name="upcoming_matches"),
    path("competitions_match/", FilteredCompetitionsView.as_view(), name="filtered_competitions"),
    path("seasons_match/", MatchSeasonsView.as_view(), name="match_seasons"),
    path("genres_match/", MatchGenresView.as_view(), name="match_genres"),
    path("filtered_matches/", FilteredMatchesView.as_view(), name="filtered_matches"),
]
