from django.urls import path
from .views import GlobalFeatureImportanceView


urlpatterns = [
    path('graphs/global_feature_importance/', GlobalFeatureImportanceView.as_view()),
]
