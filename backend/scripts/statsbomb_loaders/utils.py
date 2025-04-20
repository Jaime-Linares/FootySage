# StatsBomb information for the 2015/2016 season for the top 5 leagues
COMPETITION_ID_LA_LIGA = 11
COMPETITION_ID_PREMIER_LEAGUE = 2
COMPETITION_ID_SERIE_A = 4
COMPETITION_ID_LIGUE_1 = 5
COMPETITION_ID_1_BUNDESLIGA = 1


# information about competitions that is not included in StatsBomb but is necessary for the project
# statsbomb_id: { "api_id": <id de la API-football>, "competition_logo_url": <url of competition logo> }
competition_info = {
    COMPETITION_ID_LA_LIGA: {                   # La Liga
        "api_id": 140,
        "competition_logo_url": "https://media.api-sports.io/football/leagues/140.png"
    },
    COMPETITION_ID_PREMIER_LEAGUE: {                    # Premier League
        "api_id": 39,
        "competition_logo_url": "https://media.api-sports.io/football/leagues/39.png"
    },
    COMPETITION_ID_SERIE_A: {                    # Serie A
        "api_id": 135,
        "competition_logo_url": "https://media.api-sports.io/football/leagues/135.png"
    },
    COMPETITION_ID_LIGUE_1: {                    # Ligue 1
        "api_id": 61,
        "competition_logo_url": "https://media.api-sports.io/football/leagues/61.png"
    },
    COMPETITION_ID_1_BUNDESLIGA: {                    # 1. Bundesliga
        "api_id": 78,
        "competition_logo_url": "https://media.api-sports.io/football/leagues/78.png"
    }
}

# information about teams that is not included in StatsBomb but is necessary for the project
# team_name: { "api_id": <id of API-football>, "football_crest_url": <url of football team crest> }
team_info = {
    # La Liga
    "Athletic Club": {
        "api_id": 531,
        "football_crest_url": "https://media.api-sports.io/football/teams/531.png"
    },
    "Atlético Madrid": {
        "api_id": 530,
        "football_crest_url": "https://media.api-sports.io/football/teams/530.png"
    },
    "Barcelona": {
        "api_id": 529,
        "football_crest_url": "https://media.api-sports.io/football/teams/529.png"
    },
    "Celta Vigo": {
        "api_id": 538,
        "football_crest_url": "https://media.api-sports.io/football/teams/538.png"
    },
    "Eibar": {
        "api_id": 545,
        "football_crest_url": "https://media.api-sports.io/football/teams/545.png"
    },
    "Espanyol": {
        "api_id": 540,
        "football_crest_url": "https://media.api-sports.io/football/teams/540.png"
    },
    "Getafe": {
        "api_id": 546,
        "football_crest_url": "https://media.api-sports.io/football/teams/546.png"
    },
    "Granada": {
        "api_id": 715,
        "football_crest_url": "https://media.api-sports.io/football/teams/715.png"
    },
    "Las Palmas": {
        "api_id": 534,
        "football_crest_url": "https://media.api-sports.io/football/teams/534.png"
    },
    "Levante UD": {
        "api_id": 539,
        "football_crest_url": "https://media.api-sports.io/football/teams/539.png"
    },
    "Málaga": {
        "api_id": 535,
        "football_crest_url": "https://media.api-sports.io/football/teams/535.png"
    },
    "RC Deportivo La Coruña": {
        "api_id": 544,
        "football_crest_url": "https://media.api-sports.io/football/teams/544.png"
    },
    "Rayo Vallecano": {
        "api_id": 728,
        "football_crest_url": "https://media.api-sports.io/football/teams/728.png"
    },
    "Real Betis": {
        "api_id": 543,
        "football_crest_url": "https://media.api-sports.io/football/teams/543.png"
    },
    "Real Madrid": {
        "api_id": 541,
        "football_crest_url": "https://media.api-sports.io/football/teams/541.png"
    },
    "Real Sociedad": {
        "api_id": 548,
        "football_crest_url": "https://media.api-sports.io/football/teams/548.png"
    },
    "Sevilla": {
        "api_id": 536,
        "football_crest_url": "https://media.api-sports.io/football/teams/536.png"
    },
    "Sporting Gijón": {
        "api_id": 731,
        "football_crest_url": "https://media.api-sports.io/football/teams/731.png"
    },
    "Valencia": {
        "api_id": 532,
        "football_crest_url": "https://media.api-sports.io/football/teams/532.png"
    },
    "Villarreal": {
        "api_id": 533,
        "football_crest_url": "https://media.api-sports.io/football/teams/533.png"
    },
    # Premier League
    "AFC Bournemouth": {
        "api_id": 35,
        "football_crest_url": "https://media.api-sports.io/football/teams/35.png"
    },
    "Arsenal": {
        "api_id": 42,
        "football_crest_url": "https://media.api-sports.io/football/teams/42.png"
    },
    "Aston Villa": {
        "api_id": 66,
        "football_crest_url": "https://media.api-sports.io/football/teams/66.png"
    },
    "Chelsea": {
        "api_id": 49,
        "football_crest_url": "https://media.api-sports.io/football/teams/49.png"
    },
    "Crystal Palace": {
        "api_id": 52,
        "football_crest_url": "https://media.api-sports.io/football/teams/52.png"
    },
    "Everton": {
        "api_id": 45,
        "football_crest_url": "https://media.api-sports.io/football/teams/45.png"
    },
    "Leicester City": {
        "api_id": 46,
        "football_crest_url": "https://media.api-sports.io/football/teams/46.png"
    },
    "Liverpool": {
        "api_id": 40,
        "football_crest_url": "https://media.api-sports.io/football/teams/40.png"
    },
    "Manchester City": {
        "api_id": 50,
        "football_crest_url": "https://media.api-sports.io/football/teams/50.png"
    },
    "Manchester United": {
        "api_id": 33,
        "football_crest_url": "https://media.api-sports.io/football/teams/33.png"
    },
    "Newcastle United": {
        "api_id": 34,
        "football_crest_url": "https://media.api-sports.io/football/teams/34.png"
    },
    "Norwich City": {
        "api_id": 71,
        "football_crest_url": "https://media.api-sports.io/football/teams/71.png"
    },
    "Southampton": {
        "api_id": 41,
        "football_crest_url": "https://media.api-sports.io/football/teams/41.png"
    },
    "Stoke City": {
        "api_id": 75,
        "football_crest_url": "https://media.api-sports.io/football/teams/75.png"
    },
    "Sunderland": {
        "api_id": 746,
        "football_crest_url": "https://media.api-sports.io/football/teams/746.png"
    },
    "Swansea City": {
        "api_id": 11928,
        "football_crest_url": "https://media.api-sports.io/football/teams/11928.png"
    },
    "Tottenham Hotspur": {
        "api_id": 47,
        "football_crest_url": "https://media.api-sports.io/football/teams/47.png"
    },
    "Watford": {
        "api_id": 38,
        "football_crest_url": "https://media.api-sports.io/football/teams/38.png"
    },
    "West Bromwich Albion": {
        "api_id": 60,
        "football_crest_url": "https://media.api-sports.io/football/teams/60.png"
    },
    "West Ham United": {
        "api_id": 48,
        "football_crest_url": "https://media.api-sports.io/football/teams/48.png"
    },
    # Serie A
    "AC Milan": {
        "api_id": 489,
        "football_crest_url": "https://media.api-sports.io/football/teams/489.png"
    },
    "AS Roma": {
        "api_id": 497,
        "football_crest_url": "https://media.api-sports.io/football/teams/497.png"
    },
    "Atalanta": {
        "api_id": 499,
        "football_crest_url": "https://media.api-sports.io/football/teams/499.png"
    },
    "Bologna": {
        "api_id": 500,
        "football_crest_url": "https://media.api-sports.io/football/teams/500.png"
    },
    "Carpi": {
        "api_id": 519,
        "football_crest_url": "https://media.api-sports.io/football/teams/519.png"
    },
    "Chievo": {
        "api_id": 491,
        "football_crest_url": "https://media.api-sports.io/football/teams/491.png"
    },
    "Empoli": {
        "api_id": 511,
        "football_crest_url": "https://media.api-sports.io/football/teams/511.png"
    },
    "Fiorentina": {
        "api_id": 502,
        "football_crest_url": "https://media.api-sports.io/football/teams/502.png"
    },
    "Frosinone": {
        "api_id": 512,
        "football_crest_url": "https://media.api-sports.io/football/teams/512.png"
    },
    "Genoa": {
        "api_id": 495,
        "football_crest_url": "https://media.api-sports.io/football/teams/495.png"
    },
    "Hellas Verona": {
        "api_id": 504,
        "football_crest_url": "https://media.api-sports.io/football/teams/504.png"
    },
    "Inter Milan": {
        "api_id": 505,
        "football_crest_url": "https://media.api-sports.io/football/teams/505.png"
    },
    "Juventus": {
        "api_id": 496,
        "football_crest_url": "https://media.api-sports.io/football/teams/496.png"
    },
    "Lazio": {
        "api_id": 487,
        "football_crest_url": "https://media.api-sports.io/football/teams/487.png"
    },
    "Napoli": {
        "api_id": 492,
        "football_crest_url": "https://media.api-sports.io/football/teams/492.png"
    },
    "Palermo": {
        "api_id": 522,
        "football_crest_url": "https://media.api-sports.io/football/teams/522.png"
    },
    "Sampdoria": {
        "api_id": 498,
        "football_crest_url": "https://media.api-sports.io/football/teams/498.png"
    },
    "Sassuolo": {
        "api_id": 488,
        "football_crest_url": "https://media.api-sports.io/football/teams/488.png"
    },
    "Torino": {
        "api_id": 503,
        "football_crest_url": "https://media.api-sports.io/football/teams/503.png"
    },
    "Udinese": {
        "api_id": 494,
        "football_crest_url": "https://media.api-sports.io/football/teams/494.png"
    },
    # Ligue 1
    "AS Monaco": {
        "api_id": 91,
        "football_crest_url": "https://media.api-sports.io/football/teams/91.png"
    },
    "Angers": {
        "api_id": 77,
        "football_crest_url": "https://media.api-sports.io/football/teams/77.png"
    },
    "Bastia": {
        "api_id": 1305,
        "football_crest_url": "https://media.api-sports.io/football/teams/1305.png"
    },
    "Bordeaux": {
        "api_id": 78,
        "football_crest_url": "https://media.api-sports.io/football/teams/78.png"
    },
    "Caen": {
        "api_id": 88,
        "football_crest_url": "https://media.api-sports.io/football/teams/88.png"
    },
    "Gazélec Ajaccio": {
        "api_id": 100,
        "football_crest_url": "https://media.api-sports.io/football/teams/100.png"
    },
    "Guingamp": {
        "api_id": 90,
        "football_crest_url": "https://media.api-sports.io/football/teams/90.png"
    },
    "Lille": {
        "api_id": 79,
        "football_crest_url": "https://media.api-sports.io/football/teams/79.png"
    },
    "Lorient": {
        "api_id": 97,
        "football_crest_url": "https://media.api-sports.io/football/teams/97.png"
    },
    "Lyon": {
        "api_id": 80,
        "football_crest_url": "https://media.api-sports.io/football/teams/80.png"
    },
    "Marseille": {
        "api_id": 81,
        "football_crest_url": "https://media.api-sports.io/football/teams/81.png"
    },
    "Montpellier": {
        "api_id": 82,
        "football_crest_url": "https://media.api-sports.io/football/teams/82.png"
    },
    "Nantes": {
        "api_id": 83,
        "football_crest_url": "https://media.api-sports.io/football/teams/83.png"
    },
    "OGC Nice": {
        "api_id": 84,
        "football_crest_url": "https://media.api-sports.io/football/teams/84.png"
    },
    "Paris Saint-Germain": {
        "api_id": 85,
        "football_crest_url": "https://media.api-sports.io/football/teams/85.png"
    },
    "Rennes": {
        "api_id": 94,
        "football_crest_url": "https://media.api-sports.io/football/teams/94.png"
    },
    "Saint-Étienne": {
        "api_id": 1063,
        "football_crest_url": "https://media.api-sports.io/football/teams/1063.png"
    },
    "Stade de Reims": {
        "api_id": 93,
        "football_crest_url": "https://media.api-sports.io/football/teams/93.png"
    },
    "Toulouse": {
        "api_id": 96,
        "football_crest_url": "https://media.api-sports.io/football/teams/96.png"
    },
    "Troyes": {
        "api_id": 110,
        "football_crest_url": "https://media.api-sports.io/football/teams/110.png"
    },
    # 1. Bundesliga
    "Augsburg": {
        "api_id": 170,
        "football_crest_url": "https://media.api-sports.io/football/teams/170.png"
    },
    "Bayer Leverkusen": {
        "api_id": 168,
        "football_crest_url": "https://media.api-sports.io/football/teams/168.png"
    },
    "Bayern Munich": {
        "api_id": 157,
        "football_crest_url": "https://media.api-sports.io/football/teams/157.png"
    },
    "Borussia Dortmund": {
        "api_id": 165,
        "football_crest_url": "https://media.api-sports.io/football/teams/165.png"
    },
    "Borussia Mönchengladbach": {
        "api_id": 163,
        "football_crest_url": "https://media.api-sports.io/football/teams/163.png"
    },
    "Darmstadt 98": {
        "api_id": 181,
        "football_crest_url": "https://media.api-sports.io/football/teams/181.png"
    },
    "Eintracht Frankfurt": {
        "api_id": 169,
        "football_crest_url": "https://media.api-sports.io/football/teams/169.png"
    },
    "FC Köln": {
        "api_id": 192,
        "football_crest_url": "https://media.api-sports.io/football/teams/192.png"
    },
    "FSV Mainz 05": {
        "api_id": 164,
        "football_crest_url": "https://media.api-sports.io/football/teams/164.png"
    },
    "Hamburger SV": {
        "api_id": 175,
        "football_crest_url": "https://media.api-sports.io/football/teams/175.png"
    },
    "Hannover 96": {
        "api_id": 166,
        "football_crest_url": "https://media.api-sports.io/football/teams/166.png"
    },
    "Hertha Berlin": {
        "api_id": 159,
        "football_crest_url": "https://media.api-sports.io/football/teams/159.png"
    },
    "Hoffenheim": {
        "api_id": 167,
        "football_crest_url": "https://media.api-sports.io/football/teams/167.png"
    },
    "Ingolstadt": {
        "api_id": 184,
        "football_crest_url": "https://media.api-sports.io/football/teams/184.png"
    },
    "Schalke 04": {
        "api_id": 174,
        "football_crest_url": "https://media.api-sports.io/football/teams/174.png"
    },
    "VfB Stuttgart": {
        "api_id": 172,
        "football_crest_url": "https://media.api-sports.io/football/teams/172.png"
    },
    "Werder Bremen": {
        "api_id": 162,
        "football_crest_url": "https://media.api-sports.io/football/teams/162.png"
    },
    "Wolfsburg": {
        "api_id": 161,
        "football_crest_url": "https://media.api-sports.io/football/teams/161.png"
    }
}


# --- FUNCIONES PARA OBTENER MÁS INFORMACIÓN ACERCA DE COMPETICIONES Y EQUIPOS ----------------------------------------------------------------
def get_competition_extra_data(statsbomb_competition_id):
    '''
    Returns the api_id and competition_logo_url of a competition given its StatsBomb ID.
    params:
        statsbomb_competition_id (int): The StatsBomb ID of the competition.
    returns:
        Tuple: (api_id, competition_logo_url)
    '''
    data = competition_info.get(statsbomb_competition_id)
    if not data:
        raise ValueError(f"No se encontró información extra para la competición con ID {statsbomb_competition_id}")
    return data["api_id"], data["competition_logo_url"]


def get_team_extra_data(team_name):
    '''
    Returns the api_id and football_crest_url of a team given its name.
    params:
        team_name(str): The name of the team.
    returns:
        Tuple: (api_id, football_crest_url)
    '''
    data = team_info.get(team_name)
    if not data:
        raise ValueError(f"No se encontró información extra para el equipo '{team_name}'")
    return data["api_id"], data["football_crest_url"]

