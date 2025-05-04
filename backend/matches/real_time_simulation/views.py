from django.db import models
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


# --- View to handle requests for match initial lineups -----------------------------------------------------------------------------
class StartingLineupsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get('statsbomb_id')
        if not statsbomb_id:
            return Response({"error": "Falta el parámetro 'statsbomb_id'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)

        starting_xi_events = Event.objects.filter(match=match, type="Starting XI")
        lineups = {
            "home_team": {
                "formation": None,
                "players": [],
            },
            "away_team": {
                "formation": None,
                "players": [],
            },
        }
        for event in starting_xi_events:
            players = event.details.get("lineup", [])
            formation = event.details.get("formation")
            players_data = [
                {
                    "name": p.get("name"),
                    "position": p.get("position_name"),
                    "jersey_number": p.get("jersey_number"),
                }
                for p in players
            ]
            if event.team == match.home_team:
                lineups["home_team"]["players"] = players_data
                lineups["home_team"]["formation"] = formation
            elif event.team == match.away_team:
                lineups["away_team"]["players"] = players_data
                lineups["away_team"]["formation"] = formation

        return Response(lineups)


# --- View to handle requests for important match events ----------------------------------------------------------------------------
class ImportantMatchEventsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get('statsbomb_id')
        if not statsbomb_id:
            return Response({"error": "Falta el parámetro 'statsbomb_id'"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(match=match).order_by('period', 'minute', 'second')
        important_events = []
        for e in events:
            d = e.details
            if (
                (e.type == "Shot" and d.get("outcome") == "Goal") or
                (e.type == "Shot" and d.get("outcome") != "Goal" and d.get("statsbomb_xg", 0) > 0.2) or
                (e.type in ["Substitution", "Own Goal Against", "Bad Behaviour"]) or
                (e.type == "Foul Won" and d.get("penalty") is True) or
                (e.type == "Foul Committed" and d.get("card") in ["Yellow Card", "Second Yellow Card", "Red Card"]) or
                (e.type == "Goal Keeper" and d.get("type") in ["Penalty Saved", "Shot Saved", "Saved To Post", "Penalty Saved To Post"]) or
                (e.type == "Pass" and d.get("goal_assist") is True)
            ):
                important_events.append({
                    "minute": e.minute,
                    "period": e.period,
                    "type": e.type,
                    "team": e.team.name if e.team else None,
                    "outcome": d.get("outcome") if d.get("outcome") else None,
                    "player_name": d.get("player_name") if d.get("player_name") else None,
                    "replacement": d.get("replacement") if d.get("replacement") else None,
                    "penalty": d.get("penalty") if d.get("penalty") else None,
                    "card": d.get("card") if d.get("card") else None,
                })

        return Response(important_events)


# --- View to handle requests for match goals until a specific minute ---------------------------------------------------------------
class MatchGoalsUntilMinuteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get("statsbomb_id")
        minute = request.query_params.get("minute")
        period = request.query_params.get("period")
        if not statsbomb_id or not minute or not period:
            return Response({"error": "Parámetros requeridos: 'statsbomb_id', 'minute' y 'period'."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            minute = int(minute)
            period = int(period)
        except ValueError:
            return Response({"error": "'minute' y 'period' deben ser enteros."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)

        events = Event.objects.filter(match=match).filter(
            models.Q(period__lt=period) |
            models.Q(period=period, minute__lte=minute)
        )
        home_goals = 0
        away_goals = 0
        for event in events:
            details = event.details
            is_goal = (event.type == "Shot" and details.get("outcome") == "Goal") or (event.type == "Own Goal Against")
            if is_goal:
                if event.type == "Own Goal Against":
                    if event.team == match.home_team:
                        away_goals += 1
                    elif event.team == match.away_team:
                        home_goals += 1
                else:
                    if event.team == match.home_team:
                        home_goals += 1
                    elif event.team == match.away_team:
                        away_goals += 1
        return Response({
            "home_team_goals": home_goals,
            "away_team_goals": away_goals
        })


# --- View to handle requests for match win probability at a specific minute --------------------------------------------------------
class MatchWinProbabilityAtMinuteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        statsbomb_id = request.query_params.get("statsbomb_id")
        minute = request.query_params.get("minute")
        period = request.query_params.get("period")
        if not statsbomb_id or not minute or not period:
            return Response({"error": "Faltan parámetros: 'statsbomb_id', 'minute' y 'period'."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            minute = int(minute)
            period = int(period)
        except ValueError:
            return Response({"error": "'minute' y 'period' deben ser enteros."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            match = Match.objects.get(statsbomb_id=statsbomb_id)
        except Match.DoesNotExist:
            return Response({"error": f"No existe el partido con id {statsbomb_id}"}, status=status.HTTP_404_NOT_FOUND)
        try:
            event = Event.objects.get(match=match, type="Teams won prediction", minute=minute, period=period)
        except Event.DoesNotExist:
            return Response({"error": f"No hay evento de predicción para el minuto {minute} en el periodo {period}."}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            "home_team": event.details.get("home_team", 0),
            "draw": event.details.get("draw", 0),
            "away_team": event.details.get("away_team", 0),
        })

