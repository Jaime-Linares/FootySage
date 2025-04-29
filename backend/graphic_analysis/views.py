from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from .analysis_utils import load_matches_by_league, preprocessing, divide_data_in_train_test, compute_shap_values
import numpy as np
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
                    "importances": sorted(importance, key=lambda x: abs(x["value"]), reverse=True)[:20]
                })

        # Random Forest
        elif hasattr(model, "feature_importances_"):
            importance = [
                {"feature_name": feature_name, "value": round(imp, 4)}
                for feature_name, imp in zip(model.feature_names_in_, model.feature_importances_)
                if imp > 0 and imp >= 0.01
            ]
            result = sorted(importance, key=lambda x: x["value"], reverse=True)[:20]

        # Any other model type
        else:
            return Response({"error": "Tipo de modelo no soportado"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(result, status=status.HTTP_200_OK)


# --- View to handle requests for graph of local feature importance ---------------------------------------------------------------
class SHAPScatterDataView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        league = request.query_params.get('league')
        if not league:
            return Response({"error": "Falta el parámetro de consulta 'league'"}, status=status.HTTP_400_BAD_REQUEST)

        model_path = COMPETITION_MODELS_PATH.get(league)
        feature_names = FEATURE_NAMES_BY_LEAGUE.get(league)
        if not model_path:
            return Response({"error": f"Modelo no disponible para la liga '{league}'"}, status=status.HTTP_400_BAD_REQUEST)
        is_linear_model = league in FEATURE_NAMES_BY_LEAGUE
        feature_names = FEATURE_NAMES_BY_LEAGUE.get(league) if is_linear_model else None

        try:
            model = joblib.load(model_path)
            scaler = None
            if league in COMPETITION_SCALERS_PATH:
                scaler_path = COMPETITION_SCALERS_PATH.get(league)
                scaler = joblib.load(scaler_path)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        df = load_matches_by_league(COMPETITION_REDUCED_DATA_PATH.get(league))
        X_all, y_all, encoder, match_ids = preprocessing(df)
        X_train, X_test, y_train, y_test, _, _ = divide_data_in_train_test(X_all, y_all, match_ids)
        if is_linear_model:
            X_train = X_train[feature_names]
            X_test = X_test[feature_names]
        X_test_input = scaler.transform(X_test) if scaler else X_test
        X_train_input = scaler.transform(X_train) if scaler else X_train
        shap_values = compute_shap_values(model, X_train_input, X_test_input, feature_names if is_linear_model else None)

        num_classes = shap_values.values.shape[2]
        response = []

        for class_idx in range(num_classes):
            class_name = class_index.get(class_idx)
            class_data = []
            shap_matrix = shap_values.values[:, :, class_idx]
            current_feature_names = feature_names if is_linear_model else X_test.columns
            mean_abs_shap = np.mean(np.abs(shap_matrix), axis=0)
            top_indices = np.argsort(mean_abs_shap)[-15:][::-1]
            for feature_idx in top_indices:
                name = current_feature_names[feature_idx]
                shap_vals = shap_matrix[:, feature_idx].tolist()
                feature_vals = X_test.iloc[:, feature_idx].tolist()
                class_data.append({
                    "feature_name": name,
                    "shap_values": shap_vals,
                    "feature_values": feature_vals,
                })
            response.append({
                "class": class_name,
                "data": class_data
            })

        return Response(response, status=status.HTTP_200_OK)


# --- View to handle requests for all features common in reduced dataset ----------------------------------------------------------
class ListCommonFeaturesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        leagues = ["LaLiga", "PremierLeague", "SerieA", "Ligue1", "1Bundesliga", "Top5"]
        feature_sets = []
        for league in leagues:
            feature_names = FEATURE_NAMES_BY_LEAGUE.get(league)
            if feature_names:
                feature_sets.append(set(feature_names))
            else:
                try:
                    df = load_matches_by_league(COMPETITION_REDUCED_DATA_PATH.get(league))
                    feature_sets.append(set(df.columns) - {"match_id", "winner_team"})
                except Exception as e:
                    return Response({"error": f"Error cargando datos de {league}: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if not feature_sets:
            return Response({"error": "No se encontraron características válidas."}, status=status.HTTP_400_BAD_REQUEST)
        common_features = list(set.intersection(*feature_sets))
        return Response(common_features, status=status.HTTP_200_OK)


# --- View to handle requests for comparision graph of local feature importance ---------------------------------------------------
class SHAPCompareFeatureView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        feature_name = request.query_params.get('feature_name')
        if not feature_name:
            return Response({"error": "Falta el parámetro 'feature_name'"}, status=status.HTTP_400_BAD_REQUEST)

        leagues = ["LaLiga", "PremierLeague", "SerieA", "Ligue1", "1Bundesliga", "Top5"]
        response = []

        for league in leagues:
            try:
                model_path = COMPETITION_MODELS_PATH.get(league)
                if not model_path:
                    continue
                model = joblib.load(model_path)

                df = load_matches_by_league(COMPETITION_REDUCED_DATA_PATH.get(league))
                X_all, y_all, encoder, match_ids = preprocessing(df)
                feature_names = FEATURE_NAMES_BY_LEAGUE.get(league)
                if feature_name not in (feature_names if feature_names else X_all.columns):
                    return Response({"error": f"La característica '{feature_name}' no está disponible en {league}"}, status=status.HTTP_400_BAD_REQUEST)
                if feature_names:
                    X_all = X_all[feature_names]
                scaler = None
                if league in COMPETITION_SCALERS_PATH:
                    scaler = joblib.load(COMPETITION_SCALERS_PATH.get(league))
                X_train, X_test, y_train, y_test, _, _ = divide_data_in_train_test(X_all, y_all, match_ids)
                X_train_input = scaler.transform(X_train) if scaler else X_train
                X_test_input = scaler.transform(X_test) if scaler else X_test
                shap_values = compute_shap_values(model, X_train_input, X_test_input, feature_names if feature_names else None)
                columns_list = feature_names if feature_names else list(X_test.columns)
                feature_idx = columns_list.index(feature_name)

                classes_data = []
                num_classes = shap_values.values.shape[2]
                for class_idx in range(num_classes):
                    shap_vector = shap_values.values[:, feature_idx, class_idx].tolist()
                    feature_vector = X_test.iloc[:, feature_idx]
                    if hasattr(feature_vector, 'tolist'):
                        feature_vector = feature_vector.tolist()
                    classes_data.append({
                        "class": class_index.get(class_idx),
                        "shap_values": shap_vector,
                        "feature_values": feature_vector
                    })
                response.append({
                    "league": league,
                    "classes": classes_data
                })
            except Exception as e:
                return Response({"error": f"Error procesando {league}: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response, status=status.HTTP_200_OK)


# --- View to handle requests for listing allowed features for feature distribution comparison ------------------------------------
class ListFeatureComparisonOptionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(FEATURE_NAMES_FOR_FEATURE_LEAGUE_COMPARISION, status=status.HTTP_200_OK)


# --- View to handle feature value distribution for pie charts --------------------------------------------------------------------
class FeatureCompareDistributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        feature_name = request.query_params.get('feature_name')
        if not feature_name:
            return Response({"error": "Falta el parámetro 'feature_name'"}, status=status.HTTP_400_BAD_REQUEST)
        if feature_name not in FEATURE_NAMES_FOR_FEATURE_LEAGUE_COMPARISION:
            return Response({"error": f"La característica '{feature_name}' no está permitida para comparación"}, status=status.HTTP_400_BAD_REQUEST)

        leagues = ["LaLiga", "PremierLeague", "SerieA", "Ligue1", "1Bundesliga"]
        response = []
        for league in leagues:
            try:
                df = load_matches_by_league(COMPETITION_PROCESSED_DATA_PATH.get(league))
                feature_home = f"{feature_name}_home"
                feature_away = f"{feature_name}_away"
                if feature_home not in df.columns or feature_away not in df.columns:
                    return Response({"error": f"No se encontraron las columnas {feature_home} y {feature_away} en {league}"}, status=status.HTTP_400_BAD_REQUEST)

                total_sum_home = df[feature_home].sum()
                total_sum_away = df[feature_away].sum()
                total_sum = total_sum_home + total_sum_away
                num_matches = len(df)
                if num_matches == 0:
                    avg_per_match = 0
                else:
                    avg_per_match = total_sum / num_matches
                response.append({
                    "league": league,
                    "average_per_match": round(avg_per_match, 4),
                })
            except Exception as e:
                return Response({"error": f"Error procesando {league}: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(response, status=status.HTTP_200_OK)


# --- View to handle match shap summary for a specific match in a league ----------------------------------------------------------
class MatchSHAPSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        league = request.query_params.get('league')
        match_id = request.query_params.get('match_id')

        if not league or not match_id:
            return Response({"error": "Faltan parámetros: 'league' y 'match_id' son necesarios"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            model_path = COMPETITION_MODELS_PATH.get(league)
            data_path = COMPETITION_REDUCED_DATA_PATH.get(league)
            if not model_path or not data_path:
                return Response({"error": f"Liga '{league}' no soportada"}, status=status.HTTP_400_BAD_REQUEST)

            model = joblib.load(model_path)
            df = load_matches_by_league(data_path)
            X_all, y_all, encoder, match_ids = preprocessing(df)

            feature_names = FEATURE_NAMES_BY_LEAGUE.get(league)
            if feature_names:
                X_all = X_all[feature_names]

            match_ids = np.array(match_ids)
            if int(match_id) not in match_ids:
                return Response({"error": f"El partido '{match_id}' no existe en {league}."}, status=status.HTTP_404_NOT_FOUND)
            match_index = np.where(match_ids == int(match_id))[0][0]

            scaler = None
            if league in COMPETITION_SCALERS_PATH:
                scaler = joblib.load(COMPETITION_SCALERS_PATH.get(league))
            X_train, _, _, _, _, _ = divide_data_in_train_test(X_all, y_all, match_ids)
            X_train_input = scaler.transform(X_train) if scaler else X_train
            X_input = scaler.transform(X_all) if scaler else X_all

            shap_values = compute_shap_values(model, X_train_input, X_input, feature_names if feature_names else None)
            shap_matrix = shap_values.values
            proba = model.predict_proba(X_input)[match_index]

            num_classes = shap_matrix.shape[2]
            response = []
            for class_idx in range(num_classes):
                class_name = class_index.get(class_idx)
                shap_vector = shap_matrix[match_index, :, class_idx]
                top_indices = np.argsort(np.abs(shap_vector))[-6:][::-1]
                features_top = []
                features_list = feature_names if feature_names else list(X_all.columns)
                for feature_idx in top_indices:
                    feature_name = features_list[feature_idx]
                    shap_val = shap_vector[feature_idx]
                    feature_val = X_all.iloc[match_index, feature_idx]
                    features_top.append({
                        "feature_name": feature_name,
                        "shap_value": round(shap_val, 4),
                        "feature_value": round(float(feature_val), 4)
                    })
                response.append({
                    "class": class_name,
                    "probability": round(proba[class_idx], 4),
                    "top_features": features_top
                })
            return Response(response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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

COMPETITION_REDUCED_DATA_PATH = {
    "LaLiga": "data/reduced/La Liga(2015_2016_male)_reduced.csv",
    "PremierLeague": "data/reduced/Premier League(2015_2016_male)_reduced.csv",
    "SerieA": "data/reduced/Serie A(2015_2016_male)_reduced.csv",
    "Ligue1": "data/reduced/Ligue 1(2015_2016_male)_reduced.csv",
    "1Bundesliga": "data/reduced/1. Bundesliga(2015_2016_male)_reduced.csv",
    "Top5": "data/reduced/Top_5_leagues.csv",
}

COMPETITION_PROCESSED_DATA_PATH = {
    "LaLiga": "data/processed/La Liga(2015_2016_male)_processed.csv",
    "PremierLeague": "data/processed/Premier League(2015_2016_male)_processed.csv",
    "SerieA": "data/processed/Serie A(2015_2016_male)_processed.csv",
    "Ligue1": "data/processed/Ligue 1(2015_2016_male)_processed.csv",
    "1Bundesliga": "data/processed/1. Bundesliga(2015_2016_male)_processed.csv"
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

FEATURE_NAMES_FOR_FEATURE_LEAGUE_COMPARISION = ["total_shots", "average_shots_on_target_distance", "shots_high_xG", "shots_inside_area", "shots_foot", "shots_head", "shots_other", 
    "total_passes", "key_passes", "passes_needed_to_make_a_shot", "crosses", "corners", "interceptions_won", "recoveries", "blocks", "duels_won", "tackles", "fouls_committed", 
    "50_50_won", "clearances", "penaltys_committed", "key_errors", "miscontrols", "yellow_cards", "red_cards", "pressures", "counterpress", "pressures_in_attacking_third", "offsides", 
    "dribbles", "injury_substitutions", "players_off", "dispossessed", "counterattacks", "recoveries_attacking_third", "recoveries_middle_third", "recoveries_defensive_third", 
    "shots_under_pressure", "shots_inside_area_under_pressure", "passes_under_pressure", "passes_inside_area_under_pressure", "set_piece_shots", "set_piece_shots_inside_area", 
    "substitutions", "tactical_substitutions", "tactical_changes", "formation_changes"]

