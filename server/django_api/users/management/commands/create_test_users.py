from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()


class Command(BaseCommand):
    help = 'Crea usuarios de prueba para desarrollo (admin y cliente)'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.WARNING('Creando usuarios de prueba...'))

        # Crear usuario administrador
        admin_email = 'admin@mowi.com'
        if not User.objects.filter(email=admin_email).exists():
            admin = User.objects.create_superuser(
                email=admin_email,
                name='Admin MOWI',
                password='admin123'
            )
            self.stdout.write(
                self.style.SUCCESS(f'✓ Usuario ADMIN creado:')
            )
            self.stdout.write(f'  Email: {admin_email}')
            self.stdout.write(f'  Password: admin123')
            self.stdout.write(f'  Rol: Administrador')
        else:
            self.stdout.write(
                self.style.WARNING(f'✗ Usuario admin ya existe: {admin_email}')
            )

        # Crear usuario cliente
        client_email = 'cliente@mowi.com'
        if not User.objects.filter(email=client_email).exists():
            client = User.objects.create_user(
                email=client_email,
                name='Cliente Prueba',
                password='cliente123'
            )
            self.stdout.write(
                self.style.SUCCESS(f'\n✓ Usuario CLIENTE creado:')
            )
            self.stdout.write(f'  Email: {client_email}')
            self.stdout.write(f'  Password: cliente123')
            self.stdout.write(f'  Rol: Cliente')
        else:
            self.stdout.write(
                self.style.WARNING(f'✗ Usuario cliente ya existe: {client_email}')
            )

        self.stdout.write(
            self.style.SUCCESS('\n=== Usuarios de prueba listos ===')
        )
        self.stdout.write('\nPuedes iniciar sesión con:')
        self.stdout.write(f'  Admin: {admin_email} / admin123')
        self.stdout.write(f'  Cliente: {client_email} / cliente123')
