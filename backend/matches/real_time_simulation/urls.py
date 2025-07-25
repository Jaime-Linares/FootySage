from django.urls import path
from .views import (HalfEndMinutesView, MatchWinProbabilitiesView, StartingLineupsView, ImportantMatchEventsView, MatchGoalsUntilMinuteView, 
    MatchWinProbabilityAtMinuteView, MatchEventsAtMinuteView)


urlpatterns = [
    path('match/half_end_minutes/', HalfEndMinutesView.as_view(), name='half_end_minutes'),
    path('match/win_probabilities/', MatchWinProbabilitiesView.as_view(), name='win_probabilities'),
    path('match/starting_lineups/', StartingLineupsView.as_view(), name='starting_lineups'),
    path('match/important_events/', ImportantMatchEventsView.as_view(), name='important_events'),
    path('match/goals_until_minute/', MatchGoalsUntilMinuteView.as_view(), name='goals_until_minute'),
    path('match/win_probability_at_minute/', MatchWinProbabilityAtMinuteView.as_view(), name='win_probability_at_minute'),
    path('match/events_at_minute/', MatchEventsAtMinuteView.as_view(), name='events_at_minute'),
]
