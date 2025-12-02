from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Direccion, Wishlist

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer para el modelo de Usuario"""

    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'is_admin', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer para registro de nuevos usuarios"""

    password = serializers.CharField(write_only=True, min_length=6, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['email', 'name', 'password']

    def validate_email(self, value):
        """Validar que el email no exista"""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError('Este email ya está registrado')
        return value.lower()

    def create(self, validated_data):
        """Crear un nuevo usuario"""
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer para inicio de sesión"""

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        """Validar credenciales"""
        email = data.get('email', '').lower()
        password = data.get('password', '')

        if email and password:
            return data
        else:
            raise serializers.ValidationError('Debe proporcionar email y contraseña')


class DireccionSerializer(serializers.ModelSerializer):
    """Serializer para el modelo de Dirección"""

    class Meta:
        model = Direccion
        fields = ['id', 'usuario', 'nombre_completo', 'telefono', 'direccion', 
                  'ciudad', 'departamento', 'codigo_postal', 'referencia', 
                  'es_principal', 'fecha_creacion', 'fecha_actualizacion']
        read_only_fields = ['id', 'usuario', 'fecha_creacion', 'fecha_actualizacion']

    def create(self, validated_data):
        """Crear dirección asociada al usuario autenticado"""
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)


class WishlistSerializer(serializers.ModelSerializer):
    """Serializer para el modelo de Wishlist"""

    class Meta:
        model = Wishlist
        fields = ['id', 'usuario', 'producto_id', 'fecha_agregado']
        read_only_fields = ['id', 'usuario', 'fecha_agregado']

    def create(self, validated_data):
        """Crear item de wishlist asociado al usuario autenticado"""
        validated_data['usuario'] = self.context['request'].user
        return super().create(validated_data)
