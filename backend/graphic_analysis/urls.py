from django.urls import path
from .views import GlobalFeatureImportanceView, SHAPScatterDataView, SHAPCompareFeatureView, ListCommonFeaturesView


urlpatterns = [
    path('graphs/global_feature_importance/', GlobalFeatureImportanceView.as_view()),
    path('graphs/shap_scatter_data/', SHAPScatterDataView.as_view()),
    path('graphs/common_features/', ListCommonFeaturesView.as_view()),
    path('graphs/shap_compare_feature/', SHAPCompareFeatureView.as_view()),
]
