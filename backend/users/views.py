from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsNotAuthenticated



class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [IsNotAuthenticated]
    serializer_class = MyTokenObtainPairSerializer

