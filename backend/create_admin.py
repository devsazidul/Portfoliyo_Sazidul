
import os
import django
import sys

# Setup Django environment
sys.path.append('/Users/bdcalling/Documents/Vibrant-Showcase/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

try:
    u = User.objects.get(username='admin')
    u.set_password('admin')
    u.save()
    print("Password for 'admin' set to 'admin'")
except User.DoesNotExist:
    User.objects.create_superuser('admin', 'admin@example.com', 'admin')
    print("Superuser 'admin' created with password 'admin'")
