from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Team, Match, Competition
from .serializers import TeamSerializer, MatchSerializer, CompetitionSerializer
import datetime
import requests



# --- View to handle requests for the list of teams ---------------------------------------------------------------------------------
class TeamListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        teams = Team.objects.all()
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)


# --- View to handle requests for the list of upcoming matches ----------------------------------------------------------------------
class UpcomingMatchesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        today = datetime.date.today()
        simulated_today = today.replace(year=today.year - 1)

        matches_today = Match.objects.filter(api_creation_day=today)

        if matches_today.exists():
            matches = matches_today.order_by('date')
        else:
            Match.objects.filter(api_creation_day__lt=today).delete()
            matches = fetch_and_store_matches_from_api(simulated_today, today)

        grouped_matches = {}
        for match in matches:
            competition = match.competition
            grouped_matches.setdefault(competition.id, {"competition": competition, "matches": []})
            grouped_matches[competition.id]["matches"].append(match)

        response = [
            {
                "competition": CompetitionSerializer(group["competition"]).data,
                "matches": MatchSerializer(group["matches"], many=True).data
            }
            for group in grouped_matches.values()
        ]
        return Response(response)

# Function to fetch matches from the API and store them in the database
def fetch_and_store_matches_from_api(simulated_today, today):
    '''
    Ids of the leagues to fetch matches:
        - 140: La Liga
        - 39: Premier League
        - 135: Serie A
        - 61: Ligue 1
        - 78: 1. Bundesliga
        - 2: UEFA Champions League
        - 3: UEFA Europa League
        - 848: UEFA Europa Conference League
    '''
    headers = {
        "x-apisports-key": settings.API_FOOTBALL_KEY,
    }

    BASE_URL = "https://v3.football.api-sports.io/fixtures"
    SEASON = 2023                                   # season to fetch matches for (2023/2024 season)
    leagues = [140, 39, 135, 61, 78, 2, 3, 848]     # list of league IDs to fetch matches for

    date_from = simulated_today.isoformat()
    date_to = (simulated_today + datetime.timedelta(days=15)).isoformat()

    all_matches = []

    for league_id in leagues:
        params = {
            "league": league_id,
            "season": SEASON,
            "from": date_from,
            "to": date_to
        }

        response = requests.get(BASE_URL, headers=headers, params=params)
        if response.status_code != 200:
            continue

        fixtures = response.json().get("response", [])
        for item in fixtures:
            fixture = item["fixture"]
            league = item["league"]
            teams = item["teams"]
            goals = item["goals"]

            competition, _ = Competition.objects.get_or_create(
                api_id=league["id"],
                defaults={
                    "name": league["name"],
                    "competition_logo_url": league.get("logo", "")
                }
            )

            home_team, _ = Team.objects.get_or_create(
                api_id=teams["home"]["id"],
                defaults={
                    "name": teams["home"]["name"],
                    "football_crest_url": teams["home"]["logo"]
                }
            )
            away_team, _ = Team.objects.get_or_create(
                api_id=teams["away"]["id"],
                defaults={
                    "name": teams["away"]["name"],
                    "football_crest_url": teams["away"]["logo"]
                }
            )

            season_name = str(league["season"]) + str(int(league["season"]) + 1)
            # obtain match week from the league round string
            round_raw = league.get("round", "")
            try:
                match_week = int(round_raw.split('-')[-1].strip()) if '-' in round_raw else None
            except ValueError:
                match_week = None

            match, _ = Match.objects.update_or_create(
                api_id=fixture["id"],
                defaults={
                    "api_creation_day": today,
                    "status": Match.STATUS_SCHEDULED,
                    "season_name": season_name,
                    "genre": "male",
                    "date": fixture["date"],
                    "match_week": match_week,
                    "stadium": fixture["venue"]["name"] if fixture.get("venue") else "",
                    "home_team_coach_name": None,
                    "away_team_coach_name": None,
                    "goals_scored_home_team": None,
                    "goals_scored_away_team": None,
                    "competition": competition,
                    "home_team": home_team,
                    "away_team": away_team,
                }
            )
            all_matches.append(match)

    return all_matches

