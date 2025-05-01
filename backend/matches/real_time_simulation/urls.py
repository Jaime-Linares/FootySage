from django.urls import path
from .views import HalfEndMinutesView, MatchWinProbabilitiesView


urlpatterns = [
    path('match/half_end_minutes/', HalfEndMinutesView.as_view(), name='half_end_minutes'),
    path('match/win_probabilities/', MatchWinProbabilitiesView.as_view(), name='win_probabilities'),
]
