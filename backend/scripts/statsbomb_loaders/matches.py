# encoding:utf-8
from statsbombpy import sb
from datetime import datetime
from django.utils.timezone import is_naive, make_aware
import pytz
from matches.models import Match, Competition, Team
from .utils import get_team_extra_data
from .teams import get_or_create_team
# from .events import create_events

tz = pytz.timezone("Europe/Madrid")


def create_macthes_by_competition_id_and_season_id(competition_id, season_id):
    '''
    Create matches for a given competition and season.
    params:
        competition_id (int): The ID of the competition.
        season_id (int): The ID of the season.
    returns:
        None
    '''
    matches_df = sb.matches(competition_id=competition_id, season_id=season_id)
    if matches_df.shape[0] == 0:
        raise ValueError('No se encontraron partidos para la competición y temporada dadas.')
    for _, row in matches_df.iterrows():
        match_id = row['match_id']
        if Match.objects.filter(statsbomb_id=match_id).exists():
            print(f"Partido {match_id} ya existe. Se omite.")
            continue
        # competition
        try:
            competition = Competition.objects.get(statsbomb_id=competition_id)
        except Competition.DoesNotExist:
            print(f"La competición con ID {competition_id} no existe en la base de datos.")
            continue
        # teams
        home_team = get_or_create_team(row['home_team'])
        away_team = get_or_create_team(row['away_team'])
        # date
        try:
            date = datetime.strptime(f"{row['match_date']} {row['kick_off']}", "%Y-%m-%d %H:%M:%S.%f")
        except ValueError:
            date = datetime.strptime(f"{row['match_date']} {row['kick_off']}", "%Y-%m-%d %H:%M:%S")
        if is_naive(date):
            date = make_aware(date, timezone=tz)
        
        match = Match(
            statsbomb_id=match_id,
            api_id=None,
            api_creation_day=None,
            status='Finished',
            season_name=row['season'],
            genre="male",
            date=date,
            match_week=row['match_week'],
            match_round=None,
            stadium=row['stadium'],
            home_team_coach_name=row['home_managers'],
            away_team_coach_name=row['away_managers'],
            goals_scored_home_team=row['home_score'],
            goals_scored_away_team=row['away_score'],
            competition=competition,
            home_team=home_team,
            away_team=away_team
        )
        match.save()

        print(f"Partido {match_id} guardado: {home_team.name} vs {away_team.name} ({match.date.date()})")

        # create_events(match_id)

