# encoding:utf-8
from statsbombpy import sb
from pathlib import Path
import joblib
import numpy as np
import pandas as pd
from matches.models import Event, Match

MODEL_PATHS = {
    "La Liga": "LaLiga_model.pkl",
    "Premier League": "PremierLeague_model.pkl",
    "Serie A": "SerieA_model.pkl",
    "Ligue 1": "Ligue1_model.pkl",
    "1. Bundesliga": "1Bundesliga_model.pkl",
}

SCALER_PATHS = {
    "La Liga": "LaLiga_scaler.pkl",
    "Premier League": "PremierLeague_scaler.pkl",
    "Serie A": "SerieA_scaler.pkl",
}

selected_columns_for_La_Liga = ['shots_on_target_ratio_home', 'shots_on_target_ratio_away', 'average_shots_on_target_distance_home', 'average_shots_on_target_distance_away', 
    'shots_inside_area_ratio_home', 'shots_inside_area_ratio_away', 'pass_success_ratio_away', 'cross_success_ratio_away', 'tackles_success_ratio_away', 
    'dribbles_success_ratio_home', 'dribbles_success_ratio_away', 'set_piece_shots_on_target_ratio_home', 'set_piece_shots_on_target_ratio_away', 'last_3_matches_form_home', 
    'is_valid_last_3_matches_form_home', 'last_3_matches_form_away', 'is_valid_win_rate_last_5_matches_home', 'win_rate_last_5_matches_away', 'win_last_home_match_home_team', 
    'is_valid_win_last_home_match_home_team', 'win_last_away_match_away_team', 'goals_conceded_last_match_home', 'goals_scored_last_match_home', 'is_valid_goals_scored_last_match_home', 
    'is_valid_goals_scored_last_match_away', 'std_shots_last_3_matches_home', 'percentage_shots_high_xG_home', 'percentage_shots_inside_area_home', 'percentage_shots_head_home', 
    'percentage_shots_other_home', 'difference_passes_needed_to_make_a_shot_home', 'percentage_corners_home', 'percentage_interceptions_won_home', 'percentage_tackles_home', 
    'percentage_key_errors_home', 'percentage_yellow_cards_home', 'percentage_red_cards_home', 'percentage_pressures_home', 'percentage_counterpress_home', 'percentage_offsides_home', 
    'percentage_dribbles_home', 'percentage_dispossessed_home', 'percentage_recoveries_middle_third_home', 'percentage_recoveries_defensive_third_home', 'percentage_shots_under_pressure_home', 
    'percentage_shots_inside_area_under_pressure_home', 'percentage_passes_inside_area_under_pressure_home', 'percentage_set_piece_shots_inside_area_home', 'percentage_substitutions_home', 
    'percentage_tactical_changes_home']
selected_columns_for_Premier_League = ['shots_on_target_ratio_home', 'shots_on_target_ratio_away', 'average_shots_on_target_distance_home', 'average_shots_on_target_distance_away', 
    'shots_inside_area_ratio_home', 'shots_inside_area_ratio_away', 'pass_success_ratio_home', 'pass_success_ratio_away', 'cross_success_ratio_home', 'cross_success_ratio_away', 
    'tackles_success_ratio_home', 'dribbles_success_ratio_home', 'possession_percentage_home', 'possession_percentage_away', 'set_piece_shots_on_target_ratio_home', 
    'set_piece_shots_on_target_ratio_away', 'win_rate_last_5_matches_home', 'is_valid_win_rate_last_5_matches_home', 'win_rate_last_5_matches_away', 'win_last_home_match_home_team', 
    'is_valid_win_last_home_match_home_team', 'is_valid_win_last_away_match_away_team', 'goals_scored_last_match_home', 'goals_scored_last_match_away', 'percentage_shots_high_xG_home', 
    'percentage_shots_inside_area_home', 'percentage_shots_foot_home', 'percentage_shots_head_home', 'percentage_shots_other_home', 'difference_passes_needed_to_make_a_shot_home', 
    'percentage_interceptions_won_home', 'percentage_blocks_home', 'percentage_duels_won_home', 'percentage_tackles_home', 'percentage_clearance_home', 'percentage_miscontrols_home', 
    'percentage_yellow_cards_home', 'percentage_red_cards_home', 'percentage_offsides_home', 'percentage_dribbles_home', 'percentage_players_off_home', 'percentage_dispossessed_home', 
    'percentage_counterattacks_home', 'percentage_recoveries_attacking_third_home', 'percentage_recoveries_defensive_third_home', 'percentage_shots_inside_area_under_pressure_home', 
    'percentage_set_piece_shots_home', 'percentage_substitutions_home', 'percentage_tactical_substitutions_home', 'percentage_tactical_changes_home']
selected_columns_for_Serie_A = ['shots_on_target_ratio_home', 'shots_on_target_ratio_away', 'average_shots_on_target_distance_away', 'shots_inside_area_ratio_away', 'pass_success_ratio_home', 
    'pass_success_ratio_away', 'cross_success_ratio_away', 'tackles_success_ratio_away', 'dribbles_success_ratio_home', 'dribbles_success_ratio_away', 'set_piece_shots_on_target_ratio_home', 
    'set_piece_shots_on_target_ratio_away', 'last_3_matches_form_away', 'is_valid_last_3_matches_form_away', 'is_valid_win_rate_last_5_matches_home', 'win_rate_last_5_matches_away', 
    'win_last_home_match_home_team', 'is_valid_goals_conceded_last_match_home', 'goals_conceded_last_match_away', 'is_valid_std_shots_last_3_matches_away', 'percentage_total_shots_home', 
    'percentage_shots_high_xG_home', 'percentage_shots_inside_area_home', 'percentage_shots_foot_home', 'percentage_shots_head_home', 'percentage_total_passes_home', 'percentage_key_passes_home', 
    'difference_passes_needed_to_make_a_shot_home', 'percentage_crosses_home', 'percentage_corners_home', 'percentage_duels_won_home', 'percentage_tackles_home', 'percentage_clearance_home', 
    'percentage_penaltys_committed_home', 'percentage_key_errors_home', 'percentage_yellow_cards_home', 'percentage_red_cards_home', 'percentage_counterpress_home', 'percentage_offsides_home', 
    'percentage_injury_substitutions_home', 'percentage_players_off_home', 'percentage_counterattacks_home', 'percentage_recoveries_middle_third_home', 'percentage_shots_inside_area_under_pressure_home', 
    'percentage_passes_under_pressure_home', 'percentage_set_piece_shots_home', 'percentage_set_piece_shots_inside_area_home', 'percentage_tactical_substitutions_home', 'percentage_tactical_changes_home', 
    'percentage_formation_changes_home']


def create_prediction_events(events_df, match, competition_name, matches_df, home_team, away_team, match_week):
    '''
    Create prediction events for a given match.
    params:
        events_df (DataFrame): DataFrame containing the events of the match.
        match (Match): Match object for which to create prediction events.
        competition_name (str): Name of the competition.
        matches_df (DataFrame): DataFrame containing the matches of the competition.
        home_team (str): Name of the home team.
        away_team (str): Name of the away team.
        match_week (int): Week of the competition for the match.
    returns:
        None
    '''
    # load model
    model_path = Path(__file__).resolve().parents[2] / "models" / MODEL_PATHS[competition_name]
    model = joblib.load(model_path)
    # load scaler if needed
    if competition_name == "La Liga":
        scaler_path = Path(__file__).resolve().parents[2] / "models" / SCALER_PATHS[competition_name]
        scaler = joblib.load(scaler_path)
    elif competition_name == "Premier League":
        scaler_path = Path(__file__).resolve().parents[2] / "models" / SCALER_PATHS[competition_name]
        scaler = joblib.load(scaler_path)
    elif competition_name == "Serie A":
        scaler_path = Path(__file__).resolve().parents[2] / "models" / SCALER_PATHS[competition_name]
        scaler = joblib.load(scaler_path)
    
    # divide events into first and second half
    first_half = events_df[events_df["period"] == 1].copy()
    second_half = events_df[events_df["period"] == 2].copy()
    # calculate "real minute" for each event
    first_half["real_minute"] = first_half.apply(
        lambda row: int(row["minute"]) + (1 if row["second"] > 0 else 0),
        axis=1
    )
    second_half["real_minute"] = second_half.apply(
        lambda row: int(row["minute"]) + (1 if row["second"] > 0 else 0),
        axis=1
    )

    # 1º period
    max_minute_1 = first_half["real_minute"].max()
    for minute in range(1, max_minute_1 + 1):
        subset_df = first_half[first_half["real_minute"] <= minute]
        
        try:
            metrics_match = process_events_match(matches_df, subset_df, home_team, away_team, match_week)
            metrics_match_df = pd.DataFrame([metrics_match])
            metrics_match_for_model_df = reduce_dimensionality(metrics_match_df)
            if competition_name == "La Liga":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_La_Liga]
            elif competition_name == "Premier League":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_Premier_League]
            elif competition_name == "Serie A":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_Serie_A]
            metrics_match_for_model_array = metrics_match_for_model_df.to_numpy() if isinstance(metrics_match_for_model_df, pd.DataFrame) else metrics_match_for_model_df
            if competition_name == "La Liga" or competition_name == "Premier League" or competition_name == "Serie A":
                metrics_match_for_model_array = scaler.transform(metrics_match_for_model_array)
            probs = model.predict_proba(metrics_match_for_model_array[0].reshape(1, -1))[0]
        except Exception as e:
            raise ValueError(f"Error al predecir minuto {minute}, periodo 1: {e}")
        
        Event.objects.create(
            id=f"{match.id}_prediction_p1_m{minute}",
            index=None,
            minute=minute,
            second=0,
            period=1,
            type="Teams won prediction",
            match=match,
            team=None,
            representation=False,
            details={
                "away_team": float(np.round(probs[0], 5)),
                "draw": float(np.round(probs[1], 5)),
                "home_team": float(np.round(probs[2], 5))
            }
        )

    # 2º period
    max_minute_2 = second_half["real_minute"].max()
    for minute in range(46, max_minute_2 + 1):
        combined = pd.concat([
            first_half,
            second_half[second_half["real_minute"] <= minute]
        ])
        
        try:
            metrics_match = process_events_match(matches_df, combined, home_team, away_team, match_week)
            metrics_match_df = pd.DataFrame([metrics_match])
            metrics_match_for_model_df = reduce_dimensionality(metrics_match_df)
            if competition_name == "La Liga":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_La_Liga]
            elif competition_name == "Premier League":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_Premier_League]
            elif competition_name == "Serie A":
                metrics_match_for_model_df = metrics_match_for_model_df[selected_columns_for_Serie_A]
            metrics_match_for_model_array = metrics_match_for_model_df.to_numpy() if isinstance(metrics_match_for_model_df, pd.DataFrame) else metrics_match_for_model_df
            if competition_name == "La Liga" or competition_name == "Premier League" or competition_name == "Serie A":
                metrics_match_for_model_array = scaler.transform(metrics_match_for_model_array)
            probs = model.predict_proba(metrics_match_for_model_array[0].reshape(1, -1))[0]
        except Exception as e:
            raise ValueError(f"Error al predecir minuto {minute}, periodo 2: {e}")

        Event.objects.create(
            id=f"{match.id}_prediction_p2_m{minute}",
            index=None,
            minute=minute,
            second=0,
            period=2,
            type="Teams won prediction",
            match=match,
            team=None,
            representation=False,
            details={
                "away_team": float(np.round(probs[0], 5)),
                "draw": float(np.round(probs[1], 5)),
                "home_team": float(np.round(probs[2], 5))
            }
        )

    print(f"Predicciones generadas correctamente para el partido {match.id}")


# --- FUNCTIONS FOR PREPARING DATA FOR PREDICTION --------------------------------------------------------------------------------------------------------
# --- FUNCTIONS TO PROCESS EVENTS --------------------------------------------------------------------------------------
def process_events_match(matches_df, events_df, home_team, away_team, match_week):
    '''
    Process (obtain all relevant data) a match.
    params:
        matches_df (DataFrame): A DataFrame containing the matches of the competition.
        events_df (DataFrame): A DataFrame containing the events of the match processed.
        home_team (str): The home team name.
        away_team (str): The away team name.
        match_week (int): The week of the competition of the match processed.
    returns:
        dict: A dictionary containing the processed match.    
    '''
    # variables globales
    summary_last_x_mactches = 3
    win_percentage_last_x_matches = 5
    std_shots_last_x_matches = 3

    # algunas métricas cuya función que las calcula se llaman una sola vez
    ## cálculo de la posesión en el partido
    tuple_possession_percentage = _possession_percentage(events_df.copy(), home_team, away_team)
    ## rendimiento pasado
    tuple_last_n_matches_form_home = _last_n_matches_form(matches_df, home_team, match_week, n=summary_last_x_mactches)
    tuple_last_n_matches_form_away = _last_n_matches_form(matches_df, away_team, match_week, n=summary_last_x_mactches)
    tuple_win_rate_last_n_matches_home = _win_rate_last_n_matches(matches_df, home_team, match_week, n=win_percentage_last_x_matches)
    tuple_win_rate_last_n_matches_away = _win_rate_last_n_matches(matches_df, away_team, match_week, n=win_percentage_last_x_matches)
    ## victoria o no último partido como local o visitante del equipo local o visitante
    local_team_local_win = _win_last_home_match_home_team(matches_df, home_team, match_week)
    away_team_away_win = _win_last_away_match_away_team(matches_df, away_team, match_week)
    ## goles encajados y anotados último partido
    ### goles encajados
    tuple_goals_conceded_last_match_home = _num_goals_conceded_last_match(matches_df, home_team, match_week)
    tuple_goals_conceded_last_match_away = _num_goals_conceded_last_match(matches_df, away_team, match_week)
    ### goles anotados
    tuple_goals_scored_last_match_home = _num_goals_scored_last_match(matches_df, home_team, match_week)
    tuple_goals_scored_last_match_away = _num_goals_scored_last_match(matches_df, away_team, match_week)
    ## desviación estándar de tiros y pases en los últimos partidos
    tuple_std_shots_last_n_matches_home = _std_shots_last_n_matches(matches_df, home_team, match_week, n=std_shots_last_x_matches)
    tuple_std_shots_last_n_matches_away = _std_shots_last_n_matches(matches_df, away_team, match_week, n=std_shots_last_x_matches)

    # recolección de todas las métricas del partido
    metrics = {
        # estadísticas generales del partido
        ## tiros
        "total_shots_home": _num_event_type(events_df, home_team, 'Shot'),
        "total_shots_away": _num_event_type(events_df, away_team, 'Shot'),
        "shots_on_target_ratio_home": _ratio_shots_on_target(events_df, home_team),
        "shots_on_target_ratio_away": _ratio_shots_on_target(events_df, away_team),
        "average_shots_on_target_distance_home": _average_distance_to_goal_of_shots_on_target(events_df, home_team),
        "average_shots_on_target_distance_away": _average_distance_to_goal_of_shots_on_target(events_df, away_team),
        "shots_high_xG_home": _num_shots_high_xG(events_df, home_team),
        "shots_high_xG_away": _num_shots_high_xG(events_df, away_team),
        "shots_inside_area_home": _num_shots_inside_area(events_df, home_team),
        "shots_inside_area_away": _num_shots_inside_area(events_df, away_team),
        "shots_inside_area_ratio_home": _ratio_shots_inside_area(events_df, home_team),
        "shots_inside_area_ratio_away": _ratio_shots_inside_area(events_df, away_team),
        "shots_foot_home": _num_shots_with_body_part(events_df, home_team, "Foot"),
        "shots_foot_away": _num_shots_with_body_part(events_df, away_team, "Foot"),
        "shots_head_home": _num_shots_with_body_part(events_df, home_team, "Head"),
        "shots_head_away": _num_shots_with_body_part(events_df, away_team, "Head"),
        "shots_other_home": _num_shots_with_body_part(events_df, home_team, "Other"),
        "shots_other_away": _num_shots_with_body_part(events_df, away_team, "Other"),
        ## pases
        "total_passes_home": _num_event_type(events_df, home_team, 'Pass'),
        "total_passes_away": _num_event_type(events_df, away_team, 'Pass'),
        "pass_success_ratio_home": _ratio_sucess_passes(events_df, home_team),
        "pass_success_ratio_away": _ratio_sucess_passes(events_df, away_team),
        "key_passes_home": _num_key_passes(events_df, home_team),
        "key_passes_away": _num_key_passes(events_df, away_team),
        "passes_needed_to_make_a_shot_home": _num_passes_needed_to_make_a_shot(events_df, home_team),
        "passes_needed_to_make_a_shot_away": _num_passes_needed_to_make_a_shot(events_df, away_team),
        "crosses_home": _num_crosses(events_df, home_team),
        "crosses_away": _num_crosses(events_df, away_team),
        "cross_success_ratio_home": _ratio_success_crosses(events_df, home_team),
        "cross_success_ratio_away": _ratio_success_crosses(events_df, away_team),
        "corners_home": _num_corners(events_df, home_team),
        "corners_away": _num_corners(events_df, away_team),
        ## defensa
        "interceptions_won_home": _num_interceptions_won(events_df, home_team),
        "interceptions_won_away": _num_interceptions_won(events_df, away_team),
        "recoveries_home": _num_recoveries(events_df, home_team),
        "recoveries_away": _num_recoveries(events_df, away_team), 
        "blocks_home": _num_event_type(events_df, home_team, 'Block'),
        "blocks_away": _num_event_type(events_df, away_team, 'Block'),   
        "duels_won_home": _num_duels_won(events_df, home_team),
        "duels_won_away": _num_duels_won(events_df, away_team), 
        "tackles_home": _num_tackles(events_df, home_team),
        "tackles_away": _num_tackles(events_df, away_team),
        "tackles_success_ratio_home": _ratio_success_tackles(events_df, home_team),
        "tackles_success_ratio_away": _ratio_success_tackles(events_df, away_team),
        "fouls_committed_home": _num_event_type(events_df, home_team, 'Foul Committed'),
        "fouls_committed_away": _num_event_type(events_df, away_team, 'Foul Committed'),
        "50_50_won_home": _num_50_50_won(events_df, home_team),
        "50_50_won_away": _num_50_50_won(events_df, away_team),
        "clearances_home": _num_event_type(events_df, home_team, 'Clearance'),
        "clearances_away": _num_event_type(events_df, away_team, 'Clearance'),
        "penaltys_committed_home": _num_penaltys_committed(events_df, home_team),
        "penaltys_committed_away": _num_penaltys_committed(events_df, away_team),
        "key_errors_home": _num_event_type(events_df, home_team, 'Error'),
        "key_errors_away": _num_event_type(events_df, away_team, 'Error'),
        "miscontrols_home": _num_event_type(events_df, home_team, 'Miscontrol'),
        "miscontrols_away": _num_event_type(events_df, away_team, 'Miscontrol'),
        "yellow_cards_home": _num_cards_color_selected(events_df, home_team, "Yellow"),
        "yellow_cards_away": _num_cards_color_selected(events_df, away_team, "Yellow"),
        "red_cards_home": _num_cards_color_selected(events_df, home_team, "Red"),
        "red_cards_away": _num_cards_color_selected(events_df, away_team, "Red"),
        ## presión
        "pressures_home": _num_event_type(events_df, home_team, 'Pressure'),
        "pressures_away": _num_event_type(events_df, away_team, 'Pressure'),
        "counterpress_home": _num_counterpress(events_df, home_team),
        "counterpress_away": _num_counterpress(events_df, away_team),
        "pressures_in_attacking_third_home": _num_pressures_in_attacking_third(events_df, home_team),
        "pressures_in_attacking_third_away": _num_pressures_in_attacking_third(events_df, away_team),
        ## otros
        "offsides_home": _num_offsides(events_df, home_team),
        "offsides_away": _num_offsides(events_df, away_team),
        "dribbles_home": _num_event_type(events_df, home_team, 'Dribble'),
        "dribbles_away": _num_event_type(events_df, away_team, 'Dribble'),
        "dribbles_success_ratio_home": _ratio_success_dribbles(events_df, home_team),
        "dribbles_success_ratio_away": _ratio_success_dribbles(events_df, away_team),
        "injury_substitutions_home": _num_substitutions_because_of_injury(events_df, home_team),
        "injury_substitutions_away": _num_substitutions_because_of_injury(events_df, away_team),
        "players_off_home": _num_players_off(events_df, home_team),
        "players_off_away": _num_players_off(events_df, away_team),
        "dispossessed_home": _num_event_type(events_df, home_team, 'Dispossessed'),
        "dispossessed_away": _num_event_type(events_df, away_team, 'Dispossessed'),
        "counterattacks_home": _num_counterattacks(events_df, home_team),
        "counterattacks_away": _num_counterattacks(events_df, away_team),
        "possession_percentage_home": tuple_possession_percentage[0],
        "possession_percentage_away": tuple_possession_percentage[1],
        # estadísticas contextuales del partido
        ## recuperaciones
        "recoveries_attacking_third_home": _num_recoveries_in_part_third(events_df, home_team, "Attacking"),
        "recoveries_attacking_third_away": _num_recoveries_in_part_third(events_df, away_team, "Attacking"),
        "recoveries_middle_third_home": _num_recoveries_in_part_third(events_df, home_team, "Middle"),
        "recoveries_middle_third_away": _num_recoveries_in_part_third(events_df, away_team, "Middle"),
        "recoveries_defensive_third_home": _num_recoveries_in_part_third(events_df, home_team, "Defensive"),
        "recoveries_defensive_third_away": _num_recoveries_in_part_third(events_df, away_team, "Defensive"),
        ## eventos bajo presión
        "shots_under_pressure_home": _num_event_type_under_pressure(events_df, home_team, 'Shot', in_area=False),
        "shots_under_pressure_away": _num_event_type_under_pressure(events_df, away_team, 'Shot', in_area=False),
        "shots_inside_area_under_pressure_home": _num_event_type_under_pressure(events_df, home_team, 'Shot', in_area=True),
        "shots_inside_area_under_pressure_away": _num_event_type_under_pressure(events_df, away_team, 'Shot', in_area=True),
        "passes_under_pressure_home": _num_event_type_under_pressure(events_df, home_team, 'Pass', in_area=False),
        "passes_under_pressure_away": _num_event_type_under_pressure(events_df, away_team, 'Pass', in_area=False),
        "passes_inside_area_under_pressure_home": _num_event_type_under_pressure(events_df, home_team, 'Pass', in_area=True),
        "passes_inside_area_under_pressure_away": _num_event_type_under_pressure(events_df, away_team, 'Pass', in_area=True),
        ## jugadas a balón parado
        "set_piece_shots_home": _set_piece_shots(events_df, home_team, in_area=False),
        "set_piece_shots_away": _set_piece_shots(events_df, away_team, in_area=False),
        "set_piece_shots_inside_area_home": _set_piece_shots(events_df, home_team, in_area=True),
        "set_piece_shots_inside_area_away": _set_piece_shots(events_df, away_team, in_area=True),
        "set_piece_shots_on_target_ratio_home": _ratio_set_piece_shots_on_target(events_df, home_team),
        "set_piece_shots_on_target_ratio_away": _ratio_set_piece_shots_on_target(events_df, away_team),
        # tácticas del partido
        "substitutions_home": _num_event_type(events_df, home_team, 'Substitution'),
        "substitutions_away": _num_event_type(events_df, away_team, 'Substitution'),
        "tactical_substitutions_home": _num_tactical_substitutions(events_df, home_team),
        "tactical_substitutions_away": _num_tactical_substitutions(events_df, away_team),
        "tactical_changes_home": _num_event_type(events_df, home_team, 'Tactical Shift'),
        "tactical_changes_away": _num_event_type(events_df, away_team, 'Tactical Shift'),
        "formation_changes_home": _num_changes_in_formation(events_df, home_team),
        "formation_changes_away": _num_changes_in_formation(events_df, away_team),
        # métricas temporales
        ## rendimiento pasado
        f"last_{summary_last_x_mactches}_matches_form_home": tuple_last_n_matches_form_home[0],
        f"is_valid_last_{summary_last_x_mactches}_matches_form_home": tuple_last_n_matches_form_home[1],
        f"last_{summary_last_x_mactches}_matches_form_away": tuple_last_n_matches_form_away[0],
        f"is_valid_last_{summary_last_x_mactches}_matches_form_away": tuple_last_n_matches_form_away[1],
        f"win_rate_last_{win_percentage_last_x_matches}_matches_home": tuple_win_rate_last_n_matches_home[0],
        f"is_valid_win_rate_last_{win_percentage_last_x_matches}_matches_home": tuple_win_rate_last_n_matches_home[1],
        f"win_rate_last_{win_percentage_last_x_matches}_matches_away": tuple_win_rate_last_n_matches_away[0],
        f"is_valid_win_rate_last_{win_percentage_last_x_matches}_matches_away": tuple_win_rate_last_n_matches_away[1],
        "win_last_home_match_home_team": local_team_local_win[0],
        "is_valid_win_last_home_match_home_team": local_team_local_win[1],
        "win_last_away_match_away_team": away_team_away_win[0],
        "is_valid_win_last_away_match_away_team": away_team_away_win[1],
        ## último partido
        "goals_conceded_last_match_home": tuple_goals_conceded_last_match_home[0],
        "is_valid_goals_conceded_last_match_home": tuple_goals_conceded_last_match_home[1],
        "goals_conceded_last_match_away": tuple_goals_conceded_last_match_away[0],
        "is_valid_goals_conceded_last_match_away": tuple_goals_conceded_last_match_away[1],
        "goals_scored_last_match_home": tuple_goals_scored_last_match_home[0],
        "is_valid_goals_scored_last_match_home": tuple_goals_scored_last_match_home[1],
        "goals_scored_last_match_away": tuple_goals_scored_last_match_away[0],
        "is_valid_goals_scored_last_match_away": tuple_goals_scored_last_match_away[1],
        ## consistencia
        f"std_shots_last_{std_shots_last_x_matches}_matches_home": tuple_std_shots_last_n_matches_home[0],
        f"is_valid_std_shots_last_{std_shots_last_x_matches}_matches_home": tuple_std_shots_last_n_matches_home[1],
        f"std_shots_last_{std_shots_last_x_matches}_matches_away": tuple_std_shots_last_n_matches_away[0],
        f"is_valid_std_shots_last_{std_shots_last_x_matches}_matches_away": tuple_std_shots_last_n_matches_away[1],
    }
    return metrics


def _num_event_type(events_df, team, event_type):
    '''
    Calculate the number of the event type selected for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of the event type.
    '''
    return events_df[(events_df['team'] == team) & (events_df['type'] == event_type)].shape[0]


def _ratio_shots_on_target(events_df, team):
    '''
    Calculate the ratio of shots on target for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of shots on target.
    '''
    shots = _num_event_type(events_df, team, 'Shot')
    shots_on_target = _shots_on_target_df(events_df, team).shape[0]
    return shots_on_target / shots if shots > 0 else 0.0


def _shots_on_target_df(events_df, team):
    '''
    Get the shots on target DataFrame for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:    
        DataFrame: A DataFrame containing the shots on target
    '''
    # dataframe de los disparos a puerta claros
    shots_on_target = events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') &
                                (events_df['shot_outcome'].isin(["Goal", "Saved", "Saved To Post"]))
                                ].copy()
    # dataframes para ver si un tiro bloqueado iba a puerta o no mirando si el bloqueo es un save_block
    blocked_shots = events_df[(events_df['type'] == 'Shot') & (events_df['team'] == team) &
                              (events_df['shot_outcome'] == "Blocked") &
                              (events_df['related_events'].notnull())  # para asegurar que tiene related_events
                              ].copy()
    blocked_shots['related_blocks'] = blocked_shots['related_events'].apply(
        lambda rel_events: [event_id for event_id in rel_events 
            if event_id in events_df['id'].values and 
            events_df[events_df['id'] == event_id].iloc[0]['type'] == 'Block' and 
            'block_save_block' in events_df.columns and
            events_df[events_df['id'] == event_id].iloc[0]['block_save_block'] == True
        ]
    )
    valid_blocked_shots = blocked_shots[blocked_shots['related_blocks'].str.len() > 0]
    # concatenamos los disparos a puerta claros con los disparos bloqueados que iban a puerta
    total_shots_on_target = pd.concat([shots_on_target, valid_blocked_shots], ignore_index=True)
    return total_shots_on_target


def _average_distance_to_goal_of_shots_on_target(events_df, team):
    '''
    Calculate the average distance to goal of shots on target for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The average distance to goal of shots on target.
    '''
    shots_on_target = _shots_on_target_df(events_df, team).copy()
    shots_on_target = shots_on_target[shots_on_target['location'].notnull()]
    if(shots_on_target.shape[0] > 0):   # si hay tiros a puerta
        # calculamos la distancia de cada disparo al centro de la portería
        goal_x, goal_y = 120, 40  # coordenadas del centro de la portería
        shots_on_target['distance_to_goal'] = np.sqrt(
            (goal_x - shots_on_target['location'].str[0])**2 + 
            (goal_y - shots_on_target['location'].str[1])**2
        )
        # calculamos la media de las distancias
        average_distance = shots_on_target['distance_to_goal'].mean()
    else:   # si no hay tiros a puerta
        average_distance = 120.0  # la long. del campo de fútbol de statsbomb
    return average_distance


def _num_shots_high_xG(events_df, team):
    '''
    Calculate the number of shots with a high xG for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of shots with a high xG.
    '''
    return events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') & 
                     (events_df['shot_statsbomb_xg'] > 0.2)].shape[0]


def _num_shots_inside_area(events_df, team):
    '''
    Calculate the number of shots inside the area for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of shots inside the area.
    '''
    return events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') &
                     (events_df['location'].notnull()) &
                     (events_df['location'].apply(lambda loc: isinstance(loc, list) and 102 <= loc[0] <= 120 and 18 <= loc[1] <= 62))].shape[0]
                     

def _ratio_shots_inside_area(events_df, team):
    '''
    Calculate the ratio of shots inside the area for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of shots inside the area.
    '''
    shots = _num_event_type(events_df, team, 'Shot')
    shots_inside_area = _num_shots_inside_area(events_df, team)
    return shots_inside_area / shots if shots > 0 else 0.0


def _num_shots_with_body_part(events_df, team, body_part):
    '''
    Calculate the number of shots with a specific body part for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
        body_part (str): The body part.
    returns:
        int: The number of shots with a specific body part.
    '''
    num_shots = 0
    if body_part == "Foot" :
        num_shots = events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') & 
                              (events_df['shot_body_part'].notnull()) &
                              (events_df['shot_body_part'].isin(["Right Foot","Left Foot"]))].shape[0]
    elif body_part == "Head" or body_part == "Other":
        num_shots = events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') & 
                              (events_df['shot_body_part'].notnull()) &
                              (events_df['shot_body_part'] == body_part)].shape[0]
    else:
        raise ValueError("The body part must be 'Foot', 'Head' or 'Other'.")
    return num_shots


def _ratio_sucess_passes(events_df, team):
    '''
    Calculate the ratio of successful passes for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of successful passes.
    '''
    total_passes = _num_event_type(events_df, team, 'Pass')
    successful_passes = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                                   (events_df['pass_outcome'].isnull())].shape[0]
    return successful_passes / total_passes if total_passes > 0 else 0.0


def _num_key_passes(events_df, team):
    '''
    Calculate the number of key passes for a specific team.
    We consider a key pass to be one that assists a shot.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of key passes.
    '''
    num_key_passes = 0
    if 'pass_assisted_shot_id' in events_df.columns:
        num_key_passes = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                                   (events_df['pass_outcome'].isnull()) &                       # pase exitoso           
                                   (events_df['pass_assisted_shot_id'].notnull())].shape[0]     # pase asistente
    return num_key_passes
    
def _num_passes_needed_to_make_a_shot(events_df, team):
    '''
    Calculate the number of passes needed to make a shot for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of passes needed to make a shot.
    '''
    num_shots = _num_event_type(events_df, team, 'Shot')
    num_passes = _num_event_type(events_df, team, 'Pass')
    return num_passes / num_shots if num_shots > 0 else 0.0


def _num_crosses(events_df, team):
    '''
    Calculate the number of crosses for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of crosses.
    '''
    num_crosses = 0
    if 'pass_cross' in events_df.columns:
        num_crosses = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                                (events_df['pass_cross'] == True)].shape[0]
    return num_crosses


def _ratio_success_crosses(events_df, team):
    '''
    Calculate the ratio of successful crosses for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of successful crosses.
    '''
    total_crosses = _num_crosses(events_df, team)
    successful_crosses = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                                   (events_df['pass_cross'] == True) &
                                   (events_df['pass_outcome'].isnull())].shape[0]
    return successful_crosses / total_crosses if total_crosses > 0 else 0.0


def _num_corners(events_df, team):
    '''
    Calculate the number of corners for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of corners.
    '''
    return events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                     (events_df['pass_type'] == 'Corner')].shape[0]


def _num_interceptions_won(events_df, team):
    '''
    Calculate the number of interceptions won for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of interceptions won.
    '''
    num_interceptions_won = 0
    if 'interception_outcome' in events_df.columns:
        num_interceptions_won = events_df[(events_df['team'] == team) & (events_df['type'] == 'Interception') & 
                                          (events_df['interception_outcome'].isin(["Success","Success In Play","Success Out","Won"]))].shape[0]
    return num_interceptions_won


def _num_recoveries(events_df, team):
    '''
    Calculate the number of recoveries for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of recoveries.
    '''
    num_recoveries = 0
    if 'ball_recovery_offensive' in events_df.columns:
        num_recoveries = events_df[(events_df['team'] == team) & (events_df['type'] == 'Ball Recovery') & 
                                   (events_df['ball_recovery_offensive'] == True)].shape[0]
    return num_recoveries


def _num_duels_won(events_df, team):
    '''
    Calculate the number of duels won for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of duels won.
    '''
    num_duels_won = 0
    if 'duel_outcome' in events_df.columns:
        num_duels_won = events_df[(events_df['team'] == team) & (events_df['type'] == 'Duel') & 
                                  (events_df['duel_outcome'].isin(["Won","Success","Success In Play","Success Out"]))].shape[0]
    return num_duels_won


def _num_tackles(events_df, team):
    '''
    Calculate the number of tackles for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of tackles.
    '''
    num_tackles = 0
    if 'duel_type' in events_df.columns:
        num_tackles += events_df[(events_df['team'] == team) & (events_df['type'] == 'Duel') & 
                                (events_df['duel_type'] == "Tackle")].shape[0]
    if 'goalkeeper_type' in events_df.columns:
        num_tackles += events_df[(events_df['team'] == team) & (events_df['type'] == 'Goal Keeper') & 
                                (events_df['goalkeeper_type'] == "Smother")].shape[0]
    return num_tackles


def _ratio_success_tackles(events_df, team):
    '''
    Calculate the ratio of successful tackles for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of successful tackles.
    '''
    total_tackles = _num_tackles(events_df, team)
    successful_tackles = 0
    if 'duel_type' in events_df.columns and 'duel_outcome' in events_df.columns:
        successful_tackles += events_df[(events_df['team'] == team) & (events_df['type'] == 'Duel') &
                                        (events_df['duel_type'] == "Tackle") &
                                        (events_df['duel_outcome'].isin(["Won","Success","Success In Play","Success Out"]))].shape[0]
    if 'goalkeeper_type' in events_df.columns and 'goalkeeper_outcome' in events_df.columns:
        successful_tackles += events_df[(events_df['team'] == team) & (events_df['type'] == 'Goal Keeper') & 
                                (events_df['goalkeeper_type'] == "Smother") &
                                (events_df['goalkeeper_outcome'].isin(["Won","Success","Success In Play","Success Out"]))].shape[0]
    return successful_tackles / total_tackles if total_tackles > 0 else 0.0


def _num_50_50_won(events_df, team):
    '''
    Calculate the number of 50/50 won for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of 50/50 won.
    '''
    num_50_50_won = 0
    if '50_50' in events_df.columns:
        num_50_50_won = events_df[(events_df['team'] == team) & (events_df['type'] == '50/50') & 
                                  (events_df['50_50'].apply(
                                      lambda x: isinstance(x, dict) and x.get('outcome') and x['outcome'].get('name') in ["Won", "Success To Team"]
                                    ))].shape[0]
    return num_50_50_won


def _num_penaltys_committed(events_df, team):
    '''
    Calculate the number of penaltys committed for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of penaltys committed.
    '''
    _num_penaltys_committed = 0
    if 'foul_committed_penalty' in events_df.columns:
        _num_penaltys_committed = events_df[(events_df['team'] == team) & (events_df['type'] == 'Foul Committed') & 
                                           (events_df['foul_committed_penalty'] == True)].shape[0]
    return _num_penaltys_committed


def _num_cards_color_selected(events_df, team, card_color):
    '''
    Calculate the number of selected color cards for a specific team. Since the second yellow card 
    implies a red card, we will count it as a red card.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
        card_color (str): The color of the card.
    returns:
        int: The number of selected color cards.
    '''
    num_cards_color = 0
    if 'foul_committed_card' in events_df.columns:
        if card_color == "Yellow":
            num_cards_color += events_df[(events_df['team'] == team) & (events_df['type'] == 'Foul Committed') & 
                                        (events_df['foul_committed_card'] == "Yellow Card")].shape[0]
        elif card_color == "Red":
            num_cards_color += events_df[(events_df['team'] == team) & (events_df['type'] == 'Foul Committed') & 
                                        (events_df['foul_committed_card'].isin(["Red Card","Second Yellow"]))].shape[0]
        else:
            raise ValueError("The card color must be 'Yellow' or 'Red'.")
    if 'bad_behaviour_card' in events_df.columns:
        if card_color == "Yellow":
            num_cards_color += events_df[(events_df['team'] == team) & (events_df['type'] == 'Bad Behaviour') & 
                                        (events_df['bad_behaviour_card'] == "Yellow Card")].shape[0]
        elif card_color == "Red":
            num_cards_color += events_df[(events_df['team'] == team) & (events_df['type'] == 'Bad Behaviour') & 
                                        (events_df['bad_behaviour_card'].isin(["Red Card","Second Yellow"]))].shape[0]
        else:
            raise ValueError("The card color must be 'Yellow' or 'Red'.")
    return num_cards_color


def _num_counterpress(events_df, team):
    '''
    Calculate the number of counterpress for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of counterpress.
    '''
    num_counterpress = 0
    if 'counterpress' in events_df.columns:
        num_counterpress = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pressure') & 
                                     (events_df['counterpress'] == True)].shape[0]
    return num_counterpress


def _num_pressures_in_attacking_third(events_df, team):
    '''
    Calculate the number of pressures in the attacking third for a specific team.
    Attacking third is defined as the area from 80 to 120 in x-axis and from 0 to 80 in y-axis.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of pressures in the attacking third.
    '''
    return events_df[(events_df['team'] == team) & (events_df['type'] == 'Pressure') &
                     (events_df['location'].notnull()) &
                     (events_df['location'].apply(lambda loc: isinstance(loc, list) and 80 <= loc[0] <= 120 and 0 <= loc[1] <= 80))].shape[0]


def _num_offsides(events_df, team):
    '''
    Calculate the number of offsides for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of offsides.
    '''
    non_pass_offsides = events_df[(events_df['team'] == team) & (events_df['type'] == 'Offside')].shape[0]
    pass_offsides = events_df[(events_df['team'] == team) & (events_df['type'] == 'Pass') &
                              (events_df['pass_outcome'] == "Pass Offside")].shape[0]
    return non_pass_offsides + pass_offsides


def _ratio_success_dribbles(events_df, team):
    '''
    Calculate the ratio of successful dribbles for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of successful dribbles.
    '''
    total_dribbles = _num_event_type(events_df, team, 'Dribble')
    successful_dribbles = 0
    if 'dribble_outcome' in events_df.columns:
        successful_dribbles = events_df[(events_df['team'] == team) & (events_df['type'] == 'Dribble') & 
                                        (events_df['dribble_outcome'] == "Complete")].shape[0]
    return successful_dribbles / total_dribbles if total_dribbles > 0 else 0.0


def _num_substitutions_because_of_injury(events_df, team):
    '''
    Calculate the number of substitutions because of injury for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of substitutions because of injuries.
    '''
    num_substitutions_because_of_injuries = 0
    if 'substitution_outcome' in events_df.columns:
        num_substitutions_because_of_injuries = events_df[(events_df['team'] == team) & (events_df['type'] == 'Substitution') & 
                                                          (events_df['substitution_outcome'] == "Injury")].shape[0]
    return num_substitutions_because_of_injuries


def _num_players_off(events_df, team):
    '''
    Calculate the number of players off (injured players who have to leave the field 
    without making a substitution because there is no one left) for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of players off.
    '''
    num_players_off = 0
    if 'permanent' in events_df.columns:
        num_players_off = events_df[(events_df['team'] == team) & (events_df['type'] == 'Player Off') & 
                                    (events_df['permanent'] == True)].shape[0]
    return num_players_off


def _num_counterattacks(events_df, team):
    '''
    Calculate the number of counterattacks for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of counterattacks.
    '''
    return events_df[(events_df['team'] == team) & 
                     (events_df['play_pattern'] == "From Counter")]['possession'].nunique()


def _possession_percentage(events_df, home_team, away_team):
    '''
   Calculate the possession percentage for both the home and away teams. Ball possession refers to 
    the amount of time a team has control of the ball during a match.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        home_team (str): Home team.
        away_team (str): Away team.
    returns:
        tuple: (float, float) Containing the possession percentage for the home team and the away team.
    '''
    possession_time_by_team = {home_team: 0.0, away_team: 0.0}
    total_time = 0.0
    events_df['timestamp'] = pd.to_datetime(events_df['timestamp'], format='%H:%M:%S.%f')
    events_df = events_df.sort_values(by=['index'])

    # iteramos por cada período para que no haya problemas a la hora de calcular la posesión en los descuentos
    for period in events_df['period'].unique():
        period_events = events_df[events_df['period'] == period].copy()
        period_events['next_timestamp'] = period_events['timestamp'].shift(-1)
        period_events['next_possession'] = period_events['possession'].shift(-1)

        # calculamos la duración de cada posesión considerando el inicio de la siguiente posesión
        possession_durations = []
        for _, possession_group in period_events.groupby('possession'):
            team = possession_group['possession_team'].iloc[0]
            start_time = possession_group['timestamp'].iloc[0]
            if pd.notna(possession_group['next_possession'].iloc[-1]) and possession_group['next_possession'].iloc[-1] != possession_group['possession'].iloc[0]:
                end_time = possession_group['next_timestamp'].iloc[-1]
            else:       # si es la última posesión del período el tiempo es el último de esa posesión
                end_time = possession_group['timestamp'].iloc[-1]
            duration = (end_time - start_time).total_seconds()
            possession_durations.append({'team': team, 'duration': duration})

        # creamos un DataFrame con las duraciones
        possession_df = pd.DataFrame(possession_durations)
        # sumamos los tiempos por equipo para el período
        period_possession_time = possession_df.groupby('team')['duration'].sum()
        period_total_time = period_possession_time.sum()
        # acumulamos tiempos por equipo y tiempo total
        for team, time in period_possession_time.items():
            possession_time_by_team[team] = possession_time_by_team.get(team, 0.0) + time
        total_time += period_total_time

    # calculamos porcentajes de posesión
    home_possession = (possession_time_by_team.get(home_team, 0.0) / total_time)
    away_possession = (possession_time_by_team.get(away_team, 0.0) / total_time)
    return home_possession, away_possession


def _num_recoveries_in_part_third(events_df, team, part):
    '''
    Calculate the number of recoveries in the part especified for a specific team.
    Attacking third is defined as the area from 80 to 120 in x-axis and from 0 to 80 in y-axis.
    Middle third is defined as the area from 40 to 80 in x-axis and from 0 to 80 in y-axis.
    Defensive third is defined as the area from 0 to 40 in x-axis and from 0 to 80 in y-axis.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
        part (str): The part of the field.
    returns:
        int: The number of recoveries in the part especified.
    '''
    num_recoveries_in_part_selected = 0
    num_interceptions_in_part_selected = 0
    # dependiendo de la parte del campo que queramos calcular
    if part == "Attacking":
        x_min, x_max = 80, 120
    elif part == "Middle":
        x_min, x_max = 40, 80
    elif part == "Defensive":
        x_min, x_max = 0, 40
    else:
        raise ValueError("You must choose between Attacking, Middle or Defensive")
    # calculamos las recuperaciones en la parte del campo seleccionada
    if 'ball_recovery_offensive' in events_df.columns:
        num_recoveries_in_part_selected = events_df[(events_df['team'] == team) & (events_df['type'] == 'Ball Recovery') & 
                                                      (events_df['ball_recovery_offensive'] == True) &
                                                      (events_df['location'].notnull()) &
                                                      (events_df['location'].apply(
                                                          lambda loc: isinstance(loc, list) and x_min <= loc[0] <= x_max and 0 <= loc[1] <= 80
                                                        ))].shape[0]
    if 'interception_outcome' in events_df.columns:
        num_interceptions_in_part_selected = events_df[(events_df['team'] == team) & (events_df['type'] == 'Interception') & 
                                                         (events_df['interception_outcome'].isin(["Success","Success In Play","Success Out","Won"])) &
                                                         (events_df['location'].notnull()) &
                                                         (events_df['location'].apply(
                                                             lambda loc: isinstance(loc, list) and x_min <= loc[0] <= x_max and 0 <= loc[1] <= 80
                                                            ))].shape[0]
    return num_recoveries_in_part_selected + num_interceptions_in_part_selected


def _num_event_type_under_pressure(events_df, team, event_type, in_area):
    '''
    Calculate the number of event type selected that are under pressure for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
        event_type (str): The event type.
        in_area (bool): If the event is in the area.
    returns:
        int: The number of the event type that are under pressure.
    '''
    if event_type not in ['Pass', 'Shot']:
        raise ValueError("The event type must be 'Pass' or 'Shot'.")
    if in_area == True:
        return events_df[(events_df['team'] == team) & (events_df['type'] == event_type) & 
                         (events_df['under_pressure'] == True) &
                         (events_df['location'].notnull()) &
                         (events_df['location'].apply(
                             lambda loc: isinstance(loc, list) and 102 <= loc[0] <= 120 and 18 <= loc[1] <= 62
                            ))].shape[0]
    else:
        return events_df[(events_df['team'] == team) & (events_df['type'] == event_type) &
                     (events_df['under_pressure'] == True)].shape[0]


def _set_piece_shots(events_df, team, in_area):
    '''
    Calculate the number of shots from set pieces for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
        in_area (bool): If the shot is in the area.
    returns:
        int: The number of shots from set pieces.
    '''
    if in_area == True:
        return events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') & 
                         (events_df['play_pattern'].isin(["From Corner","From Free Kick","From Throw In","From Goal Kick","From Keeper","From Kick Off"])) &
                         (events_df['location'].notnull()) &
                         (events_df['location'].apply(
                             lambda loc: isinstance(loc, list) and 102 <= loc[0] <= 120 and 18 <= loc[1] <= 62
                            ))].shape[0]
    else:
        return events_df[(events_df['team'] == team) & (events_df['type'] == 'Shot') &
                         (events_df['play_pattern'].isin(["From Corner","From Free Kick","From Throw In","From Goal Kick","From Keeper","From Kick Off"]))
                         ].shape[0]


def _ratio_set_piece_shots_on_target(events_df, team):
    '''
    Calculate the ratio of shots on target from set pieces for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        float: The ratio of shots on target from set pieces.
    '''
    set_piece_shots = _set_piece_shots(events_df, team, in_area=False)
    shots_on_target_df = _shots_on_target_df(events_df, team)
    set_piece_shots_on_target = shots_on_target_df[
        (shots_on_target_df['play_pattern'].isin(["From Corner","From Free Kick","From Throw In","From Goal Kick","From Keeper","From Kick Off"]))
        ].shape[0]
    return set_piece_shots_on_target / set_piece_shots if set_piece_shots > 0 else 0.0


def _num_tactical_substitutions(events_df, team):
    '''
    Calculate the number of tactical substitutions for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of tactical substitutions.
    '''
    num_tactical_substitutions = 0
    if 'substitution_outcome' in events_df.columns:
        num_tactical_substitutions = events_df[(events_df['team'] == team) & (events_df['type'] == 'Substitution') & 
                                               (events_df['substitution_outcome'] == "Tactical")].shape[0]
    return num_tactical_substitutions


def _num_changes_in_formation(events_df, team):
    '''
    Calculate the number of changes in formation for a specific team.
    params:
        events_df (DataFrame): A DataFrame containing the events.
        team (str): The team.
    returns:
        int: The number of changes in formation.
    '''
    tactics_df = events_df[(events_df['team'] == team) & (events_df['tactics'].notnull())].copy()
    tactics_df['formation'] = tactics_df['tactics'].apply(
        lambda x: x['formation'] if isinstance(x, dict) and 'formation' in x else None
    )
    changes_in_formation = tactics_df['formation'].ne(tactics_df['formation'].shift()).sum() - 1    # restamos 1 porque la primera formación no cuenta
    return changes_in_formation


def _last_n_matches_form(matches_df, team, match_week, n):
    '''
    Calculate the form of the last n matches for a specific team.
    3 points per win, 1 point per draw and 0 points per loss.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
        n (int): The number of matches to consider.
    returns:
        tuple: (int, int) The form of the last n matches and a 0/1 indicating if the value is valid.
    '''
    last_n_matches_form = 0
    is_valid_last_n_matches_form = 0
    if match_week > n and n > 0:
        last_n_matches = matches_df[((matches_df['home_team'] == team) | (matches_df['away_team'] == team)) & 
                                    (matches_df['match_week'] < match_week)].tail(n)
        for _, match in last_n_matches.iterrows():
            if match['home_team'] == team:
                if match['home_score'] > match['away_score']:
                    last_n_matches_form += 3
                elif match['home_score'] == match['away_score']:
                    last_n_matches_form += 1
            elif match['away_team'] == team:
                if match['away_score'] > match['home_score']:
                    last_n_matches_form += 3
                elif match['away_score'] == match['home_score']:
                    last_n_matches_form += 1
        is_valid_last_n_matches_form = 1
    return last_n_matches_form, is_valid_last_n_matches_form


def _win_rate_last_n_matches(matches_df, team, match_week, n):
    '''
    Calculate the win rate of the last n matches for a specific team.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
        n (int): The number of matches to consider.
    returns:
        tuple: (float, int) The win rate of the last n matches and a 0/1 indicating if the value is valid.
    '''
    win_rate = 0.0
    is_valid_win_rate = 0
    if match_week > n and n > 0:
        last_n_matches = matches_df[((matches_df['home_team'] == team) | (matches_df['away_team'] == team)) & 
                                    (matches_df['match_week'] < match_week)].tail(n)
        num_wins = 0
        for _, match in last_n_matches.iterrows():
            if match['home_team'] == team and match['home_score'] > match['away_score']:
                num_wins += 1
            elif match['away_team'] == team and match['away_score'] > match['home_score']:
                num_wins += 1
        win_rate = num_wins / n
        is_valid_win_rate = 1
    return win_rate, is_valid_win_rate


def _win_last_home_match_home_team(matches_df, team, match_week):
    '''
    Calculate if the home team won the last home match.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
    returns:
        tuple: (int(0/1), int(0/1)) 1 if the home team won the last home match, 0 otherwise, and a 0/1 indicating if the value is valid.
    '''
    win_last_home_match = 0
    is_valid_win_last_home_match = 0
    last_home_match = matches_df[(matches_df['home_team'] == team) & (matches_df['match_week'] < match_week)].tail(1)
    if last_home_match.shape[0] > 0:
        if last_home_match['home_score'].values[0] > last_home_match['away_score'].values[0]:
            win_last_home_match = 1
        is_valid_win_last_home_match = 1
    return win_last_home_match, is_valid_win_last_home_match


def _win_last_away_match_away_team(matches_df, team, match_week):
    '''
    Calculate if the away team won the last away match.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
    returns:
        tuple: (int(0/1), int(0/1)) 1 if the away team won the last away match, 0 otherwise, and a 0/1 indicating if the value is valid.
    '''
    win_last_away_match = 0
    is_valid_win_last_away_match = 0
    last_away_match = matches_df[(matches_df['away_team'] == team) & (matches_df['match_week'] < match_week)].tail(1)
    if last_away_match.shape[0] > 0:
        if last_away_match['away_score'].values[0] > last_away_match['home_score'].values[0]:
            win_last_away_match = 1
        is_valid_win_last_away_match = 1
    return win_last_away_match, is_valid_win_last_away_match


def _num_goals_conceded_last_match(matches_df, team, match_week):
    '''
    Calculate the number of goals conceded in the last match by the team especified.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
    returns:
        tuple: (int, int) The number of goals conceded in the last match and a 0/1 indicating if the value is valid.
    '''
    goals_conceded_last_match = 0
    is_valid_goals_conceded_last_match = 0
    last_match = matches_df[((matches_df['home_team'] == team) | (matches_df['away_team'] == team)) & 
                            (matches_df['match_week'] < match_week)].tail(1)
    if last_match.shape[0] > 0:
        if last_match['home_team'].values[0] == team:
            goals_conceded_last_match = last_match['away_score'].values[0]
        elif last_match['away_team'].values[0] == team:
            goals_conceded_last_match = last_match['home_score'].values[0]
        is_valid_goals_conceded_last_match = 1
    return goals_conceded_last_match, is_valid_goals_conceded_last_match


def _num_goals_scored_last_match(matches_df, team, match_week):
    '''
    Calculate the number of goals scored in the last match by the team especified.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
    returns:
        tuple: (int, int) The number of goals scored in the last match and a 0/1 indicating if the value is valid.
    '''
    goals_scored_last_match = 0
    is_valid_goals_scored_last_match = 0
    last_match = matches_df[((matches_df['home_team'] == team) | (matches_df['away_team'] == team)) & 
                            (matches_df['match_week'] < match_week)].tail(1)
    if last_match.shape[0] > 0:
        if last_match['home_team'].values[0] == team:
            goals_scored_last_match = last_match['home_score'].values[0]
        elif last_match['away_team'].values[0] == team:
            goals_scored_last_match = last_match['away_score'].values[0]
        is_valid_goals_scored_last_match = 1
    return goals_scored_last_match, is_valid_goals_scored_last_match


def _std_shots_last_n_matches(matches_df, team, match_week, n):
    '''
    Calculate the standard deviation of shots in the last n matches for a specific team.
    params:
        matches_df (DataFrame): A DataFrame containing the matches.
        team (str): The team.
        match_week (int): The match week.
        n (int): The number of matches to consider.
    returns:
        tuple: (float, int) The standard deviation of shots in the last n matches and a 0/1 indicating if the value is valid.
    '''
    std_shots = 0.0
    is_valid_std_shots = 0
    if match_week > n and n > 0:
        last_n_matches = matches_df[((matches_df['home_team'] == team) | (matches_df['away_team'] == team)) & 
                                    (matches_df['match_week'] < match_week)].tail(n)
        shots = []
        for _, match in last_n_matches.iterrows():
            events_df = sb.events(match_id=match['match_id'])
            num_shots = _num_event_type(events_df, team, 'Shot')
            shots.append(num_shots)
        std_shots = np.std(shots)
        is_valid_std_shots = 1
    return std_shots, is_valid_std_shots


# --- FUNCTIONS FOR DIMENSIONALITY REDUCTION ---------------------------------------------------------------------------
def reduce_dimensionality(matches_processed_df):
    '''
    Reduces the dimensionality of the data.
    params:
        matches_processed_df (DataFrame): A DataFrame containing the processed data.
    returns:
        DataFrame: A DataFrame containing the reduced data.
    '''
    # estadísticas generales del partido
    ## tiros
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_df, 'total_shots_home', 'total_shots_away', 'percentage_total_shots_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'shots_high_xG_home', 'shots_high_xG_away', 'percentage_shots_high_xG_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'shots_inside_area_home', 'shots_inside_area_away', 'percentage_shots_inside_area_home')
    matches_processed_reduced_df = _percentage_of_shots_with_body_part_home_team(matches_processed_reduced_df, 'foot')
    matches_processed_reduced_df = _percentage_of_shots_with_body_part_home_team(matches_processed_reduced_df, 'head')
    matches_processed_reduced_df = _percentage_of_shots_with_body_part_home_team(matches_processed_reduced_df, 'other')
    ## pases
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'total_passes_home', 'total_passes_away', 'percentage_total_passes_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'key_passes_home', 'key_passes_away', 'percentage_key_passes_home')
    matches_processed_reduced_df = _difference_of_passes_needed_to_make_a_shot_home_team(matches_processed_reduced_df)
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'crosses_home', 'crosses_away', 'percentage_crosses_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'corners_home', 'corners_away', 'percentage_corners_home')
    ## defensa
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'interceptions_won_home', 'interceptions_won_away', 'percentage_interceptions_won_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'recoveries_home', 'recoveries_away', 'percentage_recoveries_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'blocks_home', 'blocks_away', 'percentage_blocks_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'duels_won_home', 'duels_won_away', 'percentage_duels_won_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'tackles_home', 'tackles_away', 'percentage_tackles_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'fouls_committed_home', 'fouls_committed_away', 'percentage_fouls_committed_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, '50_50_won_home', '50_50_won_away', 'percentage_50_50_won_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'clearances_home', 'clearances_away', 'percentage_clearance_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'penaltys_committed_home', 'penaltys_committed_away', 'percentage_penaltys_committed_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'key_errors_home', 'key_errors_away', 'percentage_key_errors_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'miscontrols_home', 'miscontrols_away', 'percentage_miscontrols_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'yellow_cards_home', 'yellow_cards_away', 'percentage_yellow_cards_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'red_cards_home', 'red_cards_away', 'percentage_red_cards_home')
    ## presión
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'pressures_home', 'pressures_away', 'percentage_pressures_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'counterpress_home', 'counterpress_away', 'percentage_counterpress_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'pressures_in_attacking_third_home', 'pressures_in_attacking_third_away', 'percentage_pressures_in_attacking_third_home')
    ## otros
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'offsides_home', 'offsides_away', 'percentage_offsides_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'dribbles_home', 'dribbles_away', 'percentage_dribbles_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'injury_substitutions_home', 'injury_substitutions_away', 'percentage_injury_substitutions_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'players_off_home', 'players_off_away', 'percentage_players_off_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'dispossessed_home', 'dispossessed_away', 'percentage_dispossessed_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'counterattacks_home', 'counterattacks_away', 'percentage_counterattacks_home')
    # estadística contextuales
    ## recuperaciones
    matches_processed_reduced_df = _percentage_of_recoveries_in_selected_third_home_team(matches_processed_reduced_df, 'attacking')
    matches_processed_reduced_df = _percentage_of_recoveries_in_selected_third_home_team(matches_processed_reduced_df, 'middle')
    matches_processed_reduced_df = _percentage_of_recoveries_in_selected_third_home_team(matches_processed_reduced_df, 'defensive')
    ## eventos bajo presión
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'shots_under_pressure_home', 'shots_under_pressure_away', 'percentage_shots_under_pressure_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'shots_inside_area_under_pressure_home', 'shots_inside_area_under_pressure_away', 'percentage_shots_inside_area_under_pressure_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'passes_under_pressure_home', 'passes_under_pressure_away', 'percentage_passes_under_pressure_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'passes_inside_area_under_pressure_home', 'passes_inside_area_under_pressure_away', 'percentage_passes_inside_area_under_pressure_home')
    ## jugadas a balón parado
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'set_piece_shots_home', 'set_piece_shots_away', 'percentage_set_piece_shots_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'set_piece_shots_inside_area_home', 'set_piece_shots_inside_area_away', 'percentage_set_piece_shots_inside_area_home')
    # tácticas
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'substitutions_home', 'substitutions_away', 'percentage_substitutions_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'tactical_substitutions_home', 'tactical_substitutions_away', 'percentage_tactical_substitutions_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'tactical_changes_home', 'tactical_changes_away', 'percentage_tactical_changes_home')
    matches_processed_reduced_df = _percentage_of_metric_home_team(matches_processed_reduced_df, 'formation_changes_home', 'formation_changes_away', 'percentage_formation_changes_home')

    return matches_processed_reduced_df


def _percentage_of_metric_home_team(matches_processed_df, name_home_column, name_away_column, name_percentage_column):
    '''
    Calculates the percentage of a specified metric for the home team from the total in the match.
    If there have been no occurrences of the metric in the match, 0.5 is assigned to each team.
    params:
        matches_processed_df (DataFrame): A DataFrame containing the processed data.
        name_home_column (str): The column name for the home team's metric.
        name_away_column (str): The column name for the away team's metric.
        name_percentage_column (str): The column name for the resulting percentage.
    returns:
        DataFrame: A DataFrame containing the percentage of the specified metric for the home team.
    '''
    if name_home_column not in matches_processed_df.columns or name_away_column not in matches_processed_df.columns:
        raise ValueError(f'Invalid column names. Valid column names are: {matches_processed_df.columns}')
    total_metric = matches_processed_df[name_home_column] + matches_processed_df[name_away_column]
    matches_processed_df[name_percentage_column] = (matches_processed_df[name_home_column] / total_metric).fillna(0.5)
    matches_processed_df.drop([name_home_column, name_away_column], axis=1, inplace=True)
    return matches_processed_df


def _percentage_of_shots_with_body_part_home_team(matches_processed_df, body_part):
    '''
    Calculates the percentage of shots with a specific body part of the home team from all the match.
    If there have been no shots with the body part in the match 0.5 for each team is assigned.
    params:
        matches_df (DataFrame): A DataFrame containing the processed data.
        body_part (str): The body part to calculate the percentage.
    returns:
        DataFrame: A DataFrame containing the percentage of shots with the body part of the home team.
    '''
    if body_part not in ['foot', 'head', 'other']:
        raise ValueError('Invalid body part. Valid body parts are: foot, head, other')
    total_shots_body_part = matches_processed_df[f'shots_{body_part}_home'] + matches_processed_df[f'shots_{body_part}_away']
    matches_processed_df[f'percentage_shots_{body_part}_home'] = (matches_processed_df[f'shots_{body_part}_home'] / total_shots_body_part).fillna(0.5)
    matches_processed_df.drop([f'shots_{body_part}_home', f'shots_{body_part}_away'], axis=1, inplace=True)
    return matches_processed_df


def _difference_of_passes_needed_to_make_a_shot_home_team(matches_processed_df):
    '''
    Calculates the difference of passes needed to make a shot of the home team.
    params:
        matches_processed_df (DataFrame): A DataFrame containing the processed data.
    returns:
        DataFrame: A DataFrame containing the difference of passes needed to make a shot of the home team.
    '''
    matches_processed_df['difference_passes_needed_to_make_a_shot_home'] = matches_processed_df['passes_needed_to_make_a_shot_home'] - matches_processed_df['passes_needed_to_make_a_shot_away']
    matches_processed_df.drop(['passes_needed_to_make_a_shot_home', 'passes_needed_to_make_a_shot_away'], axis=1, inplace=True)
    return matches_processed_df


def _percentage_of_recoveries_in_selected_third_home_team(matches_processed_df, part):
    '''
    Calculates the percentage of recoveries in a selected third of the home team.
    params:
        matches_processed_df (DataFrame): A DataFrame containing the processed data.
        part (str): The selected third.
    returns:
        DataFrame: A DataFrame containing the percentage of recoveries in the selected third of the home team.
    '''
    if part not in ['defensive', 'middle', 'attacking']:
        raise ValueError('Invalid part. Valid parts are: defensive, middle, attacking')
    total_recoveries = matches_processed_df[f'recoveries_{part}_third_home'] + matches_processed_df[f'recoveries_{part}_third_away']
    matches_processed_df[f'percentage_recoveries_{part}_third_home'] = (matches_processed_df[f'recoveries_{part}_third_home'] / total_recoveries).fillna(0.5)
    matches_processed_df.drop([f'recoveries_{part}_third_home', f'recoveries_{part}_third_away'], axis=1, inplace=True)
    return matches_processed_df

