from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db.models import Sum, Count, Q, F
from django.contrib.auth import get_user_model
from datetime import datetime, timedelta
from .models import Producto, Categoria, Pedido, DetallePedido
from .serializers import ProductoSerializer, CategoriaSerializer, UsuarioSerializer, PedidoSerializer, DetallePedidoSerializer

User = get_user_model()


@api_view(['GET'])
@permission_classes([AllowAny])
def ping(request):
    return Response({"message": "Servidor Django funcionando correctamente ✅"})


@api_view(['GET'])
@permission_classes([AllowAny])  # Permitir acceso sin autenticación para estadísticas
def ventas_por_categoria(request):
    """Ventas totales agrupadas por categoría"""
    ventas = DetallePedido.objects.values('producto__categoria__nombre').annotate(
        total_ventas=Sum(F('cantidad') * F('precio_unitario'))
    ).order_by('-total_ventas')
    
    resultado = []
    for venta in ventas:
        resultado.append({
            'categoria': venta['producto__categoria__nombre'] or 'Sin categoría',
            'total': float(venta['total_ventas']) if venta['total_ventas'] else 0
        })
    
    return Response(resultado)


@api_view(['GET'])
@permission_classes([AllowAny])  # Permitir acceso sin autenticación para estadísticas
def productos_mas_vendidos(request):
    """Productos más vendidos con porcentajes"""
    # Total de productos vendidos
    total_vendidos = Producto.objects.aggregate(total=Sum('vendidos'))['total'] or 0
    
    # Productos con sus ventas
    productos = Producto.objects.values('nombre', 'categoria__nombre', 'vendidos').order_by('-vendidos')[:6]
    
    resultado = []
    colores = ['#ff6b35', '#ffd93d', '#4299e1', '#48bb78', '#9f7aea', '#ed8936']
    
    for i, producto in enumerate(productos):
        porcentaje = (producto['vendidos'] / total_vendidos * 100) if total_vendidos > 0 else 0
        resultado.append({
            'nombre': producto['nombre'],
            'categoria': producto['categoria__nombre'] or 'Sin categoría',
            'vendidos': producto['vendidos'],
            'porcentaje': round(porcentaje, 1),
            'color': colores[i % len(colores)]
        })
    
    return Response(resultado)


@api_view(['GET'])
@permission_classes([AllowAny])  # Permitir acceso sin autenticación para estadísticas
def usuarios_activos_semana(request):
    """Usuarios activos en la última semana (basado en date_joined)"""
    fecha_inicio = datetime.now() - timedelta(days=6)
    
    # Contar usuarios registrados por día en la última semana
    usuarios = User.objects.filter(date_joined__gte=fecha_inicio).extra(
        select={'dia': 'DATE(date_joined)'}
    ).values('dia').annotate(cantidad=Count('id'))
    
    # Crear lista con todos los días de la semana
    resultado = []
    for i in range(7):
        fecha = (datetime.now() - timedelta(days=6-i)).date()
        cantidad = 0
        
        for usuario in usuarios:
            if usuario['dia'] == fecha:
                cantidad = usuario['cantidad']
                break
        
        resultado.append({
            'fecha': fecha.strftime('%Y-%m-%d'),
            'dia': fecha.strftime('%d/%m'),
            'cantidad': cantidad
        })
    
    return Response(resultado)


class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer


class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UsuarioSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
