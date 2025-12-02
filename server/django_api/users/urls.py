from django.urls import path
from .views import (
    register_view, login_view,
    direcciones_list_create, direccion_detail,
    wishlist_list_create, wishlist_delete, wishlist_check
)

urlpatterns = [
    # Autenticación
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    
    # Direcciones
    path('direcciones/', direcciones_list_create, name='direcciones-list-create'),
    path('direcciones/<int:pk>/', direccion_detail, name='direccion-detail'),
    
    # Wishlist
    path('wishlist/', wishlist_list_create, name='wishlist-list-create'),
    path('wishlist/<int:producto_id>/', wishlist_delete, name='wishlist-delete'),
    path('wishlist/check/<int:producto_id>/', wishlist_check, name='wishlist-check'),
]
