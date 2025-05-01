from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from matches.models import Match, Event


# --- View to handle requests for half end minutes ----------------------------------------------------------------------------------
class HalfEndMinutesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get('statsbomb_id')
        if not statsbomb_id:
            return Response({"error": "Falta el parámetro 'statsbomb_id'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(match=match)
        first_half = events.filter(period=1).order_by('-minute').first()
        second_half = events.filter(period=2).order_by('-minute').first()

        return Response({
            "first_half_final_minute": first_half.minute if first_half else None,
            "second_half_final_minute": second_half.minute if second_half else None
        })


# --- View to handle requests for match win probabilities ---------------------------------------------------------------------------
class MatchWinProbabilitiesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get('statsbomb_id')
        if not statsbomb_id:
            return Response({"error": "Falta el parámetro 'statsbomb_id'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(match=match, type='Teams won prediction').order_by('period', 'minute')
        first_half = []
        second_half = []
        for event in events:
            prob_data = {
                "minute": event.minute,
                "home_team": event.details.get('home_team', 0),
                "draw": event.details.get('draw', 0),
                "away_team": event.details.get('away_team', 0)
            }
            if event.period == 1:
                first_half.append(prob_data)
            elif event.period == 2:
                second_half.append(prob_data)
        return Response({
            "first_half": first_half,
            "second_half": second_half,
        })

