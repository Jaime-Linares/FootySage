import django, os, sys
from pathlib import Path
from statsbomb_loaders.competitions import create_competition

# setup Django environment
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()


# StatsBomb information for the 2015/2016 season for the top 5 leagues
COMPETITION_ID_LA_LIGA = 11
COMPETITION_ID_PREMIER_LEAGUE = 2
COMPETITION_ID_SERIE_A = 4
COMPETITION_ID_LIGUE_1 = 5
COMPETITION_ID_1_BUNDESLIGA = 1
SEASON_ID = 27
TARGETS = [(COMPETITION_ID_LA_LIGA, SEASON_ID), (COMPETITION_ID_PREMIER_LEAGUE, SEASON_ID), (COMPETITION_ID_SERIE_A, SEASON_ID), 
            (COMPETITION_ID_LIGUE_1, SEASON_ID), (COMPETITION_ID_1_BUNDESLIGA, SEASON_ID)]



if __name__ == "__main__":
    print(f"CARGANDO DATOS DE STATSBOMB\n")
    for competition_id, season_id in TARGETS:
        print(f"---------------------------------------------------------------------------")
        print(f"📥 Cargando datos para competición {competition_id}, temporada {season_id}")
        print(f"---------------------------------------------------------------------------")
        create_competition(competition_id, season_id)
    print(f"\nDATOS CARGADOS CON ÉXITO")

