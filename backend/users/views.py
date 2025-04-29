from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status, generics
from django.db import models
from django.shortcuts import get_object_or_404
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from .permissions import IsNotAuthenticated
from .models import User
from .serializers import MyTokenObtainPairSerializer, RegisterSerializer, UserProfileSerializer, ChangePasswordSerializer
from matches.models import Team, Match, UserTimesAnalyzedMatch, UserFavoriteMatch
from matches.serializers import TeamSerializer, MatchSerializer



# --- This view is used to obtain JWT tokens for authentication ---------------------------------------------------------------------
class CustomTokenObtainPairView(TokenObtainPairView):
    permission_classes = [IsNotAuthenticated]
    serializer_class = MyTokenObtainPairSerializer


# --- This view is used to register new users ---------------------------------------------------------------------------------------
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


# --- View to handle requests for favorites teams of a user -------------------------------------------------------------------------
class UserFavoriteTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        teams = Team.objects.filter(userfavoriteteam__user__id=user_id)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)


# --- View to handle requests for the latest match to analyze of each favorite team of a user ---------------------------------------
class LatestMatchToAnalyzePerFavoriteTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        favorite_teams = Team.objects.filter(userfavoriteteam__user__id=user_id)
        latest_matches = []
        match_ids_seen = set()

        for team in favorite_teams:
            match = Match.objects.filter(
                status=Match.STATUS_FINISHED
            ).filter(
                models.Q(home_team=team) | models.Q(away_team=team)
            ).order_by('-date').first()

            if match and match.id not in match_ids_seen:
                latest_matches.append(match)
                match_ids_seen.add(match.id)

        if not latest_matches:
            return Response({"detail": "No hay partidos finalizados recientemente de tus equipos favoritos para analizar."}, status=200)
        serializer = MatchSerializer(latest_matches, many=True)
        return Response(serializer.data)


# --- View to handle requests for favorite matches of a user ------------------------------------------------------------------------
class UserFavoriteMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        matches = Match.objects.filter(userfavoritematch__user__id=user_id)
        if not matches.exists():
            return Response({"detail": "Este usuario no tiene partidos favoritos."}, status=200)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# --- View to handle requests for the top three most analyzed matches of a user -----------------------------------------------------
class TopThreeMostAnalyzedMatchesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        top_matches = UserTimesAnalyzedMatch.objects.filter(user__id=user_id).order_by('-times_analyzed')[:3]
        if not top_matches.exists():
            return Response({"detail": "Este usuario no ha analizado ningún partido aún."}, status=200)
        matches = [entry.match for entry in top_matches]
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)


# --- View to handle requests for the user profile information ----------------------------------------------------------------------
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)

    def put(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if user != request.user:
            return Response({"detail": "No tienes permiso para editar este perfil."}, status=403)

        serializer = UserProfileSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"detail": "Perfil actualizado correctamente."})
        return Response(serializer.errors, status=400)


# --- View to handle requests for change the user password --------------------------------------------------------------------------
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if request.user != user:
            return Response({'detail': 'No tienes permiso para cambiar esta contraseña'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({'detail': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)


# --- View to handle requests for deleting the user account -------------------------------------------------------------------------
class DeleteUserView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if request.user != user:
            return Response({'detail': 'No tienes permiso para eliminar esta cuenta'}, status=status.HTTP_403_FORBIDDEN)

        user.delete()
        return Response({'detail': 'Cuenta eliminada correctamente'}, status=status.HTTP_200_OK)


# --- View to handle requests for stablish a new user favorite match ----------------------------------------------------------------
class AddFavoriteMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, match_id):
        user = request.user
        match = get_object_or_404(Match, id=match_id)

        if UserFavoriteMatch.objects.filter(user=user, match=match).exists():
            return Response({"detail": "Este partido ya está marcado como favorito"}, status=status.HTTP_200_OK)

        UserFavoriteMatch.objects.create(user=user, match=match)
        return Response({"detail": "Partido marcado como favorito correctamente"}, status=status.HTTP_201_CREATED)


# --- View to handle requests for removing a user favorite match --------------------------------------------------------------------
class RemoveFavoriteMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, match_id):
        user = request.user
        match = get_object_or_404(Match, id=match_id)

        favorite = UserFavoriteMatch.objects.filter(user=user, match=match).first()
        if not favorite:
            return Response({"detail": "Este partido no está marcado como favorito"}, status=status.HTTP_404_NOT_FOUND)

        favorite.delete()
        return Response({"detail": "Partido eliminado de favoritos correctamente"}, status=status.HTTP_200_OK)


# --- View to handle requests for sending a password reset email --------------------------------------------------------------------
class SendPasswordResetEmailView(APIView):
    permission_classes = [IsNotAuthenticated]

    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()
        if user:
            token = PasswordResetTokenGenerator().make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_link = f"http://localhost:3000/reset-password/{uid}/{token}"
            send_mail(
                subject="Recuperación de contraseña",
                message=f"Pulsa en este enlace para cambiar tu contraseña: {reset_link}",
                from_email="info.footysage@gmail.com",
                recipient_list=[email]
            )
        return Response({"message": "Si el correo está registrado, se ha enviado un enlace para restablecer la contraseña."})


# --- View to handle requests for resetting the password using the token sent by email ----------------------------------------------
class ResetPasswordView(APIView):
    permission_classes = [IsNotAuthenticated]

    def post(self, request):
        uidb64 = request.data.get('uid')
        token = request.data.get('token')
        new_password = request.data.get('new_password')

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "El enlace no es válido."}, status=400)

        if PasswordResetTokenGenerator().check_token(user, token):
            user.set_password(new_password)
            user.save()
            return Response({"message": "Contraseña restablecida con éxito."})
        return Response({"error": "El token ha expirado o es inválido."}, status=400)

