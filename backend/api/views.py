from rest_framework import viewsets
from .models import Project, Document, ContactMessage
from .serializers import ProjectSerializer, DocumentSerializer, ContactMessageSerializer

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        queryset = Project.objects.all()
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category=category)
        return queryset

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def get_queryset(self):
        queryset = Document.objects.all()
        category = self.request.query_params.get('category')
        if category and category != 'All':
            queryset = queryset.filter(category=category)
        return queryset

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer

    def perform_create(self, serializer):
        # Save the message first
        instance = serializer.save()
        
        # Send email
        from django.core.mail import send_mail
        from django.conf import settings
        
        try:
            subject = f"New Contact Message: {instance.subject}"
            message = f"""
            You have received a new contact message.
            
            Name: {instance.name}
            Email: {instance.email}
            Subject: {instance.subject}
            
            Message:
            {instance.message}
            """
            
            send_mail(
                subject,
                message,
                settings.EMAIL_HOST_USER,  # From email (your email)
                [settings.EMAIL_HOST_USER], # To email (also your email)
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
            # We don't stop the creation even if email fails, or we could raise an error.
