from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Producto, Categoria, Pedido, DetallePedido

User = get_user_model()

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)

    class Meta:
        model = Producto
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    # Campos opcionales para compatibilidad con frontend (read-only para mostrar)
    nombre = serializers.SerializerMethodField()
    rol = serializers.SerializerMethodField()
    activo = serializers.BooleanField(source='is_active', read_only=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'nombre', 'is_active', 'activo', 'is_staff', 'is_admin', 'rol', 'password', 'date_joined']
        read_only_fields = ['id', 'date_joined', 'rol', 'nombre']
        extra_kwargs = {
            'name': {'required': False},
            'email': {'required': False},
        }
    
    def get_nombre(self, obj):
        """Devolver name como nombre para compatibilidad con frontend"""
        return obj.name
    
    def get_rol(self, obj):
        """Determinar el rol basado en is_admin e is_staff"""
        if obj.is_admin or obj.is_staff:
            return 'admin'
        return 'cliente'
    
    def to_internal_value(self, data):
        """Transformar datos del frontend antes de validar"""
        # Crear copia mutable si es necesario
        if hasattr(data, '_mutable'):
            data = data.copy()
        elif isinstance(data, dict):
            data = dict(data)
        else:
            data = dict(data.items())
        
        # Si viene 'nombre', convertirlo a 'name'
        if 'nombre' in data and 'name' not in data:
            data['name'] = data.pop('nombre')
        
        # Si viene 'activo', convertirlo a 'is_active'
        if 'activo' in data and 'is_active' not in data:
            data['is_active'] = data.pop('activo')
        
        # Si viene 'rol', convertirlo a 'is_admin' e 'is_staff'
        if 'rol' in data:
            rol = data.pop('rol')
            if rol == 'admin':
                data['is_admin'] = True
                data['is_staff'] = True
            else:
                data['is_admin'] = False
                data['is_staff'] = False
        
        return super().to_internal_value(data)
    
    def update(self, instance, validated_data):
        """Actualizar usuario manejando campos personalizados"""
        # Manejar password si viene
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        # Actualizar campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance
    
    def create(self, validated_data):
        """Crear usuario manejando campos personalizados"""
        password = validated_data.pop('password', None)
        
        user = User.objects.create_user(
            email=validated_data.get('email'),
            name=validated_data.get('name', ''),
            password=password if password else None,
            is_admin=validated_data.get('is_admin', False),
            is_staff=validated_data.get('is_staff', False),
            is_active=validated_data.get('is_active', True)
        )
        
        return user

class PedidoSerializer(serializers.ModelSerializer):
    usuario_nombre = serializers.SerializerMethodField()
    usuario_email = serializers.CharField(source='usuario.email', read_only=True)

    class Meta:
        model = Pedido
        fields = '__all__'
    
    def get_usuario_nombre(self, obj):
        return obj.usuario.get_full_name()

class DetallePedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model = DetallePedido
        fields = '__all__'
