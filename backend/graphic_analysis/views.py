from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
import joblib
import os



# --- View to handle requests for graph of global feature importance --------------------------------------------------------------
class GlobalFeatureImportanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        league = request.query_params.get('league')
        if not league:
            return Response({"error": "Falta el parámetro de consulta 'league'"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            model_path = COMPETITION_MODELS_PATH.get(league)
            if model_path is None:
                return Response({"error": f"Nombre de liga inválido '{league}'"}, status=status.HTTP_400_BAD_REQUEST)
            model = joblib.load(model_path)
        except FileNotFoundError:
            return Response({"error": f"No se encontró un modelo para la liga '{league}'"}, status=status.HTTP_404_NOT_FOUND)

        # Logistic Regression
        if hasattr(model, "coef_"):
            coef_matrix = model.coef_
            feature_names = FEATURE_NAMES_BY_LEAGUE.get(league)
            if not feature_names:
                return Response({"error": f"Los nombres de las características para la liga '{league}' no están definidos"}, status=status.HTTP_400_BAD_REQUEST)
            result = []
            for i, class_coef in enumerate(coef_matrix):
                importance = [
                    {"feature_name": feature_names[j], "value": round(class_coef[j], 4)}
                    for j in range(len(feature_names))
                    if class_coef[j] != 0 and abs(class_coef[j]) > 0.05
                ]
                result.append({
                    "class": class_index.get(i),
                    "importances": sorted(importance, key=lambda x: abs(x["value"]), reverse=True)
                })

        # Random Forest
        elif hasattr(model, "feature_importances_"):
            importance = [
                {"feature_name": feature_name, "value": round(imp, 4)}
                for feature_name, imp in zip(model.feature_names_in_, model.feature_importances_)
                if imp > 0 and imp >= 0.01
            ]
            result = sorted(importance, key=lambda x: x["value"], reverse=True)

        # Any other model type
        else:
            return Response({"error": "Tipo de modelo no soportado"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK)


# --- Constants -------------------------------------------------------------------------------------------------------------------
class_index = {
    0: "Victoria del equipo visitante",
    1: "Empate",
    2: "Victoria del equipo local",
}

COMPETITION_MODELS_PATH = {
    "LaLiga": "models/LaLiga_model.pkl",
    "PremierLeague": "models/PremierLeague_model.pkl",
    "SerieA": "models/SerieA_model.pkl",
    "Ligue1": "models/Ligue1_model.pkl",
    "1Bundesliga": "models/1Bundesliga_model.pkl",
    "Top5": "models/Top5Leagues_model.pkl",
}
COMPETITION_SCALERS_PATH = {
    "LaLiga": "models/LaLiga_scaler.pkl",
    "PremierLeague": "models/PremierLeague_scaler.pkl",
    "SerieA": "models/SerieA_scaler.pkl"
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
FEATURE_NAMES_BY_LEAGUE = {
    "LaLiga": selected_columns_for_La_Liga,
    "PremierLeague": selected_columns_for_Premier_League,
    "SerieA": selected_columns_for_Serie_A,
}

