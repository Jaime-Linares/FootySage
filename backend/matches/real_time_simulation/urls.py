from django.urls import path
from .views import HalfEndMinutesView, MatchWinProbabilitiesView, StartingLineupsView


urlpatterns = [
    path('match/half_end_minutes/', HalfEndMinutesView.as_view(), name='half_end_minutes'),
    path('match/win_probabilities/', MatchWinProbabilitiesView.as_view(), name='win_probabilities'),
    path('match/starting_lineups/', StartingLineupsView.as_view(), name='starting_lineups'),
]
