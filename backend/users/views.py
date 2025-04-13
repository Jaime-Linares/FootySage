from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer
from .models import User
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsNotAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, generics



# This view is used to obtain JWT tokens for authentication
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [IsNotAuthenticated]
    serializer_class = MyTokenObtainPairSerializer


# This view is used to register new users
class RegisterView(generics.CreateAPIView):
    permission_classes = [IsNotAuthenticated]
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        # create tokens for user
        refresh = RefreshToken.for_user(user)
        access = refresh.access_token
        # response with tokens and user info
        return Response({
            'access': str(access),
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)

