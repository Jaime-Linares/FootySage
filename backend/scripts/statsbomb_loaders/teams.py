# encoding:utf-8
from matches.models import Team
from .utils import get_team_extra_data


def get_or_create_team(team_name):
    '''
    Get or create a team object in the database.
    params:
        team_name (str): The team object to create or get.
    returns:
        team: The team object.
    '''
    team, created = Team.objects.get_or_create(name=team_name)

    if created:
        try:
            api_id, crest_url = get_team_extra_data(team_name)
            team.api_id = api_id
            team.football_crest_url = crest_url
        except ValueError:
            print(f"No hay info extendida para '{team_name}'. Se crea básico.")
            team.api_id = None
            team.football_crest_url = ''
        team.name = team_name
        team.save()
        print(f"Equipo guardado: {team_name}")
    return team

