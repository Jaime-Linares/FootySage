from django.conf import settings
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd
import shap
import os



def load_matches_by_league(league_path):
    '''
    Load the matches dataset for a specific league.
    params:
        league_path (str): Path to the league data.
    returns:
        pd.DataFrame: DataFrame containing the matches data for the specified league.
    '''
    full_path = os.path.join(settings.BASE_DIR, 'graphic_analysis', league_path)
    if not os.path.exists(full_path):
        raise FileNotFoundError(f"No se encontró el archivo: {full_path}")
    return pd.read_csv(full_path)


def divide_data_in_train_test(data, target, match_ids, test_size=0.2, stratify=True):
    '''
    Divides the data into training and test sets with stratification.
    params:
        data (DataFrame): A DataFrame containing the data.
        target (DataFrame): A DataFrame containing the target.
        test_size (float): The size of the test set.
        stratify (bool): Whether to stratify the data or not.
    returns:
        tuple: A tuple containing the training and test sets.
    '''
    X_train, X_test, y_train, y_test, match_ids_train, match_ids_test = train_test_split(data, target, match_ids, random_state=42,
                                                                                         test_size=test_size, stratify=target if stratify else None)
    return X_train, X_test, y_train, y_test, match_ids_train, match_ids_test


def preprocessing(matches_df_copy):
    '''
    Preprocesses the given DataFrame by copying it, extracting match IDs, and encoding the target variable.
    params:
        matches_df_copy (DataFrame): A DataFrame containing match data with columns "match_id" and "winner_team".
    returns:
        tuple: A tuple containing:
            X (DataFrame): The feature matrix.
            y (Series): The encoded target variable.
            encoder (object): The encoder used for encoding the target variable.
            match_ids (ndarray): An array of match IDs.
    '''
    matches_df_copy = matches_df_copy.copy()
    match_ids = matches_df_copy["match_id"].values
    X = matches_df_copy.drop(columns=["winner_team", "match_id"])
    y = matches_df_copy["winner_team"]
    y, encoder = code_categorical_data_multiclass(y)
    return X, y, encoder, match_ids

def code_categorical_data_multiclass(processed_data):
    '''
    Encodes the categorical data with more than 2 classes.
    params:
        processed_data (DataFrame): A DataFrame containing the proccesed_data.
    returns:
        tuple: A tuple containing the processed data and the encoder.
    '''
    encoder = LabelEncoder()
    encoder.fit(["away_team", "draw", "home_team"])
    processed_data = encoder.transform(processed_data)
    return processed_data, encoder


def compute_shap_values(model, X_train, X_test, feature_names=None):
    '''
    Compute SHAP values for a multiclass classification model.
    params:
        model (object): Pre-trained model (e.g., Logistic Regression or Random Forest).
        X_train (DataFrame): Training data (not scaled if no scaler is used).
        X_test (DataFrame or np.array): Data on which SHAP values will be computed.
        feature_names (list): List of feature names.
    returns:
        shap.Explanation: Object containing the SHAP values.
    '''
    if hasattr(model, "estimators_"):
        explainer = shap.TreeExplainer(model)
    else:
        explainer = shap.Explainer(model.predict_proba, X_train, feature_names=feature_names)
    shap_values = explainer(X_test)
    return shap_values

