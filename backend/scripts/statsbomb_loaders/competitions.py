# encoding:utf-8
from django.db import transaction
from statsbombpy import sb
from matches.models import Competition
from .utils import get_competition_extra_data
from .matches import create_macthes_by_competition_id_and_season_id


def create_competition(competition_id, season_id, gender):
    '''
    Create a competition object in the database.
    params:
        competition_id (int): The ID of the competition to create.
        season_id (int): The ID of the season to create.
        gender (str): The genre of the competition to create.
    returns:
        None
    '''
    competitions = sb.competitions()
    competition = competitions[(competitions['competition_id'] == competition_id) & (competitions['season_id'] == season_id) & (competitions['competition_gender'] == gender)]
    if competition.shape[0] == 0:
        raise ValueError('Competición no encontrada.')
    competition_data = competition.iloc[0]
    if Competition.objects.filter(statsbomb_id=competition_data["competition_id"]).exists():
        print(f"La competición {competition_data["competition_name"]} ({competition_data["season_name"]}) ya existe en la base de datos.")
        return
    
    with transaction.atomic():
        api_id, competition_logo_url = get_competition_extra_data(competition_id)
        competition = Competition(
            statsbomb_id=competition_id,
            api_id=api_id,
            name=competition_data["competition_name"],
            competition_logo_url=competition_logo_url,
        )
        competition.save()
        print(f"Competición {competition_data["competition_name"]} ({competition_data["season_name"]}) creada exitosamente. Cargando partidos...")

        create_macthes_by_competition_id_and_season_id(competition_id, season_id)

