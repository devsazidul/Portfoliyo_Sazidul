from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.TextField(blank=True, null=True) # Using TextField for Base64 or URL

    def __str__(self):
        return f"{self.user.username}'s Profile"

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.TextField()
    technologies = models.JSONField(default=list)  # Using JSONField for array compatibility
    link = models.CharField(max_length=500, blank=True, null=True)
    github = models.CharField(max_length=500, blank=True, null=True)
    apk_file = models.TextField(blank=True, null=True)
    figma_link = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.title

class Document(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    type = models.CharField(max_length=50) # PDF, DOC, etc.
    category = models.CharField(max_length=100)
    file_url = models.TextField() # Changed to TextField to store Base64
    size = models.CharField(max_length=50)

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.subject}"
