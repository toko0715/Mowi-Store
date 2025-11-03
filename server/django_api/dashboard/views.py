from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum, Count, Q
from datetime import datetime, timedelta
from .models import Producto, Categoria, Usuario, Pedido, DetallePedido
from .serializers import ProductoSerializer, CategoriaSerializer, UsuarioSerializer, PedidoSerializer, DetallePedidoSerializer


@api_view(['GET'])
def ping(request):
    return Response({"message": "Servidor Django funcionando correctamente ✅"})


@api_view(['GET'])
def ventas_por_categoria(request):
    """Ventas totales agrupadas por categoría"""
    ventas = DetallePedido.objects.values('producto__categoria__nombre').annotate(
        total_ventas=Sum('subtotal')
    ).order_by('-total_ventas')
    
    resultado = []
    for venta in ventas:
        resultado.append({
            'categoria': venta['producto__categoria__nombre'] or 'Sin categoría',
            'total': float(venta['total_ventas']) if venta['total_ventas'] else 0
        })
    
    return Response(resultado)


@api_view(['GET'])
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
def usuarios_activos_semana(request):
    """Usuarios activos en la última semana (basado en fecha_registro)"""
    fecha_inicio = datetime.now() - timedelta(days=6)
    
    # Contar usuarios registrados por día en la última semana
    usuarios = Usuario.objects.filter(fecha_registro__gte=fecha_inicio).extra(
        select={'dia': 'DATE(fecha_registro)'}
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
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer


class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer


class DetallePedidoViewSet(viewsets.ModelViewSet):
    queryset = DetallePedido.objects.all()
    serializer_class = DetallePedidoSerializer
