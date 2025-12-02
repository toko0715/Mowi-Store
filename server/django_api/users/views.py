from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.viewsets import ModelViewSet
from django.contrib.auth import authenticate, get_user_model
from .models import Direccion, Wishlist
from .serializers import (
    RegisterSerializer, LoginSerializer, UserSerializer,
    DireccionSerializer, WishlistSerializer
)

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
                'is_admin': user.is_admin,
                'is_staff': user.is_staff
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
                'is_admin': user.is_admin,
                'is_staff': user.is_staff
            }
        }, status=status.HTTP_200_OK)

    return Response({
        'error': 'Email o contraseña incorrectos'
    }, status=status.HTTP_401_UNAUTHORIZED)


# ==================== DIRECCIONES ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def direcciones_list_create(request):
    """
    GET: Listar direcciones del usuario autenticado
    POST: Crear nueva dirección
    """
    if request.method == 'GET':
        direcciones = Direccion.objects.filter(usuario=request.user)
        serializer = DireccionSerializer(direcciones, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = DireccionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def direccion_detail(request, pk):
    """
    GET: Obtener dirección específica
    PUT/PATCH: Actualizar dirección
    DELETE: Eliminar dirección
    """
    try:
        direccion = Direccion.objects.get(pk=pk, usuario=request.user)
    except Direccion.DoesNotExist:
        return Response({'error': 'Dirección no encontrada'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = DireccionSerializer(direccion)
        return Response(serializer.data)

    elif request.method in ['PUT', 'PATCH']:
        serializer = DireccionSerializer(direccion, data=request.data, partial=request.method == 'PATCH')
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        direccion.delete()
        return Response({'message': 'Dirección eliminada exitosamente'}, status=status.HTTP_204_NO_CONTENT)


# ==================== WISHLIST ====================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def wishlist_list_create(request):
    """
    GET: Listar items de wishlist del usuario autenticado
    POST: Agregar producto a wishlist
    """
    if request.method == 'GET':
        wishlist_items = Wishlist.objects.filter(usuario=request.user)
        serializer = WishlistSerializer(wishlist_items, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        producto_id = request.data.get('producto_id')
        
        if not producto_id:
            return Response({'error': 'producto_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si ya existe
        if Wishlist.objects.filter(usuario=request.user, producto_id=producto_id).exists():
            return Response({'error': 'Este producto ya está en tu wishlist'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = WishlistSerializer(data={'producto_id': producto_id}, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wishlist_delete(request, producto_id):
    """
    DELETE: Eliminar producto de wishlist
    """
    try:
        wishlist_item = Wishlist.objects.get(usuario=request.user, producto_id=producto_id)
        wishlist_item.delete()
        return Response({'message': 'Producto eliminado de wishlist'}, status=status.HTTP_204_NO_CONTENT)
    except Wishlist.DoesNotExist:
        return Response({'error': 'Producto no encontrado en wishlist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_check(request, producto_id):
    """
    GET: Verificar si un producto está en la wishlist del usuario
    """
    existe = Wishlist.objects.filter(usuario=request.user, producto_id=producto_id).exists()
    return Response({'en_wishlist': existe})
