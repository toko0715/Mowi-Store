from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categorias', views.CategoriaViewSet)
router.register(r'productos', views.ProductoViewSet)
router.register(r'usuarios', views.UsuarioViewSet)
router.register(r'pedidos', views.PedidoViewSet)
router.register(r'detalles', views.DetallePedidoViewSet)

urlpatterns = [
    path('ping/', views.ping, name='ping'),
    path('ventas-por-categoria/', views.ventas_por_categoria, name='ventas-por-categoria'),
    path('productos-mas-vendidos/', views.productos_mas_vendidos, name='productos-mas-vendidos'),
    path('usuarios-activos-semana/', views.usuarios_activos_semana, name='usuarios-activos-semana'),
    path('', include(router.urls)),
]
