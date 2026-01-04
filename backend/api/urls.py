from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactMessageViewSet, ProjectViewSet, DocumentViewSet, UserViewSet
from .test import TestViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'projects', ProjectViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'contact', ContactMessageViewSet)
router.register(r'test', TestViewSet, basename='test')

urlpatterns = [
    path('', include(router.urls)),
]
