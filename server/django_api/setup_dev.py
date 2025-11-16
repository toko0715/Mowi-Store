#!/usr/bin/env python
"""
Script de configuración inicial para desarrollo
Ejecuta migraciones y crea usuarios de prueba
"""
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django_api.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()


def main():
    print("=" * 60)
    print("  CONFIGURACIÓN INICIAL - MOWI Store")
    print("=" * 60)

    # 1. Ejecutar migraciones
    print("\n[1/3] Ejecutando migraciones de base de datos...")
    try:
        call_command('makemigrations', interactive=False)
        call_command('migrate', interactive=False)
        print("✓ Migraciones completadas")
    except Exception as e:
        print(f"✗ Error en migraciones: {e}")
        return

    # 2. Crear usuarios de prueba
    print("\n[2/3] Creando usuarios de prueba...")
    try:
        call_command('create_test_users')
    except Exception as e:
        print(f"✗ Error creando usuarios: {e}")
        return

    # 3. Mostrar resumen
    print("\n[3/3] Resumen de configuración:")
    print("=" * 60)
    print(f"  Total de usuarios: {User.objects.count()}")
    print(f"  Administradores: {User.objects.filter(is_staff=True).count()}")
    print(f"  Clientes: {User.objects.filter(is_staff=False).count()}")
    print("=" * 60)

    print("\n✓ ¡Configuración completada!")
    print("\nPróximos pasos:")
    print("  1. Inicia el servidor: python manage.py runserver")
    print("  2. Inicia el frontend cliente: cd ../../client/react-client && npm start")
    print("  3. Inicia el AdminPanel: cd ../../AdminPanel && npm run dev")
    print("\nCredenciales de acceso:")
    print("  Admin:   admin@mowi.com / admin123")
    print("  Cliente: cliente@mowi.com / cliente123")
    print()


if __name__ == '__main__':
    main()
