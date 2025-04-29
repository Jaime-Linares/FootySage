from django.urls import path
from .views import (GlobalFeatureImportanceView, SHAPScatterDataView, SHAPCompareFeatureView, ListCommonFeaturesView, FeatureCompareDistributionView, ListFeatureComparisonOptionsView, 
    MatchSHAPSummaryView, MatchFeatureDistributionView)


urlpatterns = [
    path('graphs/global_feature_importance/', GlobalFeatureImportanceView.as_view()),
    path('graphs/shap_scatter_data/', SHAPScatterDataView.as_view()),
    path('graphs/common_features/', ListCommonFeaturesView.as_view()),
    path('graphs/shap_compare_feature/', SHAPCompareFeatureView.as_view()),
    path('graphs/feature_compare_distribution_options/', ListFeatureComparisonOptionsView.as_view()),
    path('graphs/feature_compare_distribution/', FeatureCompareDistributionView.as_view()),
    path('graphs/match_shap_summary/', MatchSHAPSummaryView.as_view()),
    path('graphs/match_feature_distribution/', MatchFeatureDistributionView.as_view()),
]
