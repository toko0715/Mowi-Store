from rest_framework import serializers
from django.contrib.auth import get_user_model

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
