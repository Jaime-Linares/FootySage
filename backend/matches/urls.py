from django.urls import path
from .views import TeamListView, UpcomingMatchesView


urlpatterns = [
    path("teams/", TeamListView.as_view(), name="team_list"),
    path("upcoming_matches/", UpcomingMatchesView.as_view(), name="upcoming_matches"),
]
