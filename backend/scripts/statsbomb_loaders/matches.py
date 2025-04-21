# encoding:utf-8
from datetime import datetime
import pytz
from django.utils.timezone import is_naive, make_aware
from django.db import transaction
from statsbombpy import sb
from matches.models import Match, Competition, Team
from .utils import get_team_extra_data
from .teams import get_or_create_team
from .events import create_events

tz = pytz.timezone("Europe/Madrid")


def create_macthes_by_competition_id_and_season_id(competition_id, season_id, num_max_matches):
    '''
    Create matches for a given competition and season.
    params:
        competition_id (int): The ID of the competition.
        season_id (int): The ID of the season.
    returns:
        None
    '''
    matches_df = sb.matches(competition_id=competition_id, season_id=season_id)
    # if exists num_max_matches, filter matches after week 19
    if num_max_matches != None:
        matches_after_week_19 = matches_df[matches_df["match_week"] >= 19].sort_values("match_week")
        if matches_after_week_19.shape[0] >= num_max_matches:
            matches_to_create_df = matches_after_week_19.head(num_max_matches)
        else:
            remaining = num_max_matches - matches_after_week_19.shape[0]
            matches_before_week_19 = matches_df[matches_df["match_week"] < 19].sort_values("match_week", ascending=False)
            extra_matches = matches_before_week_19.head(remaining)
            matches_to_create_df = pd.concat([matches_after_week_19, extra_matches]).sort_values("match_week")
    else:   # if num_max_matches is None, get all matches of the season
        matches_to_create_df = matches_df
    if matches_to_create_df.shape[0] == 0:
        raise ValueError('No se encontraron partidos para la competición y temporada dadas.')
    for _, row in matches_to_create_df.iterrows():
        with transaction.atomic():
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
            print(f"Partido {match_id} guardado: {home_team.name} vs {away_team.name} ({match.date.date()}). Cargando eventos...")

            try:
                create_events(match_id, match, competition.name, matches_df, row['home_team'], row['away_team'], row['match_week'])
            except Exception as e:
                raise ValueError(f"Error al guardar eventos del partido {match_id}: {str(e)}")

