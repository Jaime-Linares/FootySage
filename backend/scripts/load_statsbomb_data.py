# encoding:utf-8
import sys, os, django
from pathlib import Path
# setup Django environment
PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()
# warnings to ignore
import warnings
warnings.filterwarnings("ignore", category=UserWarning, module="statsbombpy.api_client")
# imports loaders
from statsbomb_loaders.competitions import create_competition



# StatsBomb information for the 2015/2016 season for the top 5 leagues
COMPETITION_ID_LA_LIGA = 11
COMPETITION_ID_PREMIER_LEAGUE = 2
COMPETITION_ID_SERIE_A = 12
COMPETITION_ID_LIGUE_1 = 7
COMPETITION_ID_1_BUNDESLIGA = 9
SEASON_ID = 27
GENDER = "male"
TARGETS = [(COMPETITION_ID_LA_LIGA, SEASON_ID, GENDER), (COMPETITION_ID_PREMIER_LEAGUE, SEASON_ID, GENDER), (COMPETITION_ID_SERIE_A, SEASON_ID, GENDER), 
            (COMPETITION_ID_LIGUE_1, SEASON_ID, GENDER), (COMPETITION_ID_1_BUNDESLIGA, SEASON_ID, GENDER)]


if __name__ == "__main__":
    print(f"CARGANDO DATOS DE STATSBOMB\n")
    for competition_id, season_id, gender in TARGETS:
        print(f"---------------------------------------------------------------------------")
        print(f"📥 Cargando datos para competición {competition_id}, temporada {season_id}")
        print(f"---------------------------------------------------------------------------")
        create_competition(competition_id, season_id, gender)
    print(f"\nDATOS CARGADOS CON ÉXITO")

