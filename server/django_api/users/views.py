from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer

User = get_user_model()


@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    """
    Endpoint para registrar nuevos usuarios (clientes)
    POST /api/register/
    Body: { "email": "user@example.com", "name": "John Doe", "password": "password123" }
    """
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()

        return Response({
            'message': 'Usuario creado exitosamente',
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'is_admin': user.is_admin
            }
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """
    Endpoint para iniciar sesión (clientes y administradores)
    POST /api/login/
    Body: { "email": "user@example.com", "password": "password123" }
    """
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = request.data.get('email', '').lower()
    password = request.data.get('password', '')

    # Autenticar usuario
    user = authenticate(request, username=email, password=password)

    if user is not None:
        if not user.is_active:
            return Response({
                'error': 'Esta cuenta está desactivada'
            }, status=status.HTTP_403_FORBIDDEN)

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Inicio de sesión exitoso',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'is_admin': user.is_admin
            }
        }, status=status.HTTP_200_OK)

    return Response({
        'error': 'Email o contraseña incorrectos'
    }, status=status.HTTP_401_UNAUTHORIZED)
