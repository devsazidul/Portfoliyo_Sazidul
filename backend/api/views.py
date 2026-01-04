from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Project, Document, ContactMessage, Profile
from .serializers import ProjectSerializer, DocumentSerializer, ContactMessageSerializer, UserSerializer
from django.contrib.auth.models import User

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get', 'patch'])
    def me(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = self.get_serializer(user)
            return Response(serializer.data)
        
        elif request.method == 'PATCH':
            try:
                # Handle profile image update manually if nested serializer is readonly or tricky
                profile_data = request.data.get('profile', {})
                print(f"DEBUG: Received profile data: {profile_data.keys()}") # Avoid printing huge base64
                
                if profile_data:
                    profile, created = Profile.objects.get_or_create(user=user)
                    if 'image' in profile_data:
                        profile.image = profile_data['image']
                        profile.save()
                        print("DEBUG: Profile image updated successfully")
                
                # Allow updating user fields if needed
                serializer = self.get_serializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                
                print(f"DEBUG: Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"ERROR in me PATCH: {e}")
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
