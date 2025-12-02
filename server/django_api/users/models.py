from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    """Manager personalizado para el modelo de Usuario"""

    def create_user(self, email, name, password=None, **extra_fields):
        """Crea y guarda un usuario regular"""
        if not email:
            raise ValueError('El email es obligatorio')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        """Crea y guarda un superusuario (administrador)"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('El superusuario debe tener is_staff=True')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('El superusuario debe tener is_superuser=True')

        return self.create_user(email, name, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modelo de Usuario personalizado"""

    email = models.EmailField(unique=True, max_length=255, verbose_name='Correo Electrónico')
    name = models.CharField(max_length=255, verbose_name='Nombre Completo')
    is_active = models.BooleanField(default=True, verbose_name='Activo')
    is_staff = models.BooleanField(default=False, verbose_name='Es Staff')
    is_admin = models.BooleanField(default=False, verbose_name='Es Administrador')
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Registro')

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-date_joined']

    def __str__(self):
        return self.email

    def get_full_name(self):
        return self.name

    def get_short_name(self):
        return self.name.split()[0] if self.name else self.email


class Direccion(models.Model):
    """Modelo para direcciones de envío de usuarios"""
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='direcciones')
    nombre_completo = models.CharField(max_length=255, verbose_name='Nombre Completo')
    telefono = models.CharField(max_length=20, verbose_name='Teléfono')
    direccion = models.CharField(max_length=500, verbose_name='Dirección')
    ciudad = models.CharField(max_length=100, verbose_name='Ciudad')
    departamento = models.CharField(max_length=100, verbose_name='Departamento')
    codigo_postal = models.CharField(max_length=20, blank=True, null=True, verbose_name='Código Postal')
    referencia = models.TextField(blank=True, null=True, verbose_name='Referencia')
    es_principal = models.BooleanField(default=False, verbose_name='Dirección Principal')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name='Fecha de Actualización')

    class Meta:
        verbose_name = 'Dirección'
        verbose_name_plural = 'Direcciones'
        ordering = ['-es_principal', '-fecha_creacion']

    def __str__(self):
        return f"{self.nombre_completo} - {self.direccion}, {self.ciudad}"

    def save(self, *args, **kwargs):
        # Si se marca como principal, desmarcar las demás direcciones del usuario
        if self.es_principal:
            Direccion.objects.filter(usuario=self.usuario, es_principal=True).update(es_principal=False)
        super().save(*args, **kwargs)


class Wishlist(models.Model):
    """Modelo para lista de deseos (wishlist) de usuarios"""
    
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist_items')
    producto_id = models.BigIntegerField(verbose_name='ID del Producto (Spring Boot)')
    fecha_agregado = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de Agregado')

    class Meta:
        verbose_name = 'Item de Wishlist'
        verbose_name_plural = 'Items de Wishlist'
        unique_together = ['usuario', 'producto_id']  # Un usuario no puede tener el mismo producto dos veces
        ordering = ['-fecha_agregado']

    def __str__(self):
        return f"{self.usuario.email} - Producto ID: {self.producto_id}"