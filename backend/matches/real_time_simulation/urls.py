from django.urls import path
from .views import HalfEndMinutesView


urlpatterns = [
    path('match/half_end_minutes/', HalfEndMinutesView.as_view(), name='half_end_minutes'),
]
