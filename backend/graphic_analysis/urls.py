from django.urls import path
from .views import GlobalFeatureImportanceView, SHAPScatterDataView


urlpatterns = [
    path('graphs/global_feature_importance/', GlobalFeatureImportanceView.as_view()),
    path('graphs/shap_scatter_data/', SHAPScatterDataView.as_view()),
]
