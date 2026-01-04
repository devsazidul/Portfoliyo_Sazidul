
import os
import django
import sys

# Setup Django environment
sys.path.append('/Users/bdcalling/Documents/Vibrant-Showcase/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Project, Document

def seed_projects():
    projects_data = [
      {
        "title": "Sazidul",
        "description": "A full-featured online store with payment integration, inventory management, and real-time analytics.",
        "category": "Web",
        "image": "",
        "technologies": ["React", "Node.js", "PostgreSQL", "Stripe"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
      {
        "title": "AI Chat Application",
        "description": "Real-time chat application powered by AI with natural language processing and sentiment analysis.",
        "category": "AI",
        "image": "",
        "technologies": ["Python", "TensorFlow", "React", "WebSocket"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
      {
        "title": "Dashboard Analytics",
        "description": "Interactive data visualization dashboard with real-time metrics and customizable widgets.",
        "category": "Design",
        "image": "",
        "technologies": ["TypeScript", "D3.js", "Next.js", "GraphQL"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
      {
        "title": "Mobile Fitness App",
        "description": "Cross-platform fitness tracking application with workout plans and progress monitoring.",
        "category": "Mobile",
        "image": "",
        "technologies": ["React Native", "Firebase", "Redux", "Node.js"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
      {
        "title": "SaaS Project Manager",
        "description": "Collaborative project management tool with Kanban boards, time tracking, and team communication.",
        "category": "Web",
        "image": "",
        "technologies": ["Vue.js", "Express", "MongoDB", "Socket.io"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
      {
        "title": "Crypto Portfolio Tracker",
        "description": "Real-time cryptocurrency portfolio tracking with price alerts and market analysis.",
        "category": "Finance",
        "image": "",
        "technologies": ["React", "Node.js", "WebSocket", "Charts.js"],
        "link": "https://example.com",
        "github": "https://github.com",
      },
    ]

    for p_data in projects_data:
        Project.objects.get_or_create(title=p_data['title'], defaults=p_data)
        print(f"Seeded Project: {p_data['title']}")

def seed_documents():
    documents_data = [
      {
        "title": "React Best Practices Guide",
        "description": "Comprehensive guide covering React patterns, performance optimization, and modern development practices.",
        "type": "PDF",
        "category": "Guide",
        "file_url": "#",
        "size": "2.4 MB",
      },
      {
        "title": "API Documentation Template",
        "description": "Professional API documentation template with interactive examples and code snippets.",
        "type": "DOC",
        "category": "Template",
        "file_url": "#",
        "size": "1.8 MB",
      },
      {
        "title": "TypeScript Cheat Sheet",
        "description": "Quick reference guide for TypeScript types, generics, and utility functions.",
        "type": "PDF",
        "category": "Reference",
        "file_url": "#",
        "size": "856 KB",
      },
      {
        "title": "UI Component Library",
        "description": "Design system documentation with color palettes, typography, and component specifications.",
        "type": "PDF",
        "category": "Design",
        "file_url": "#",
        "size": "5.2 MB",
      },
      {
        "title": "Database Schema Designs",
        "description": "Collection of database schema designs and ER diagrams for common application patterns.",
        "type": "XLS",
        "category": "Technical",
        "file_url": "#",
        "size": "1.2 MB",
      },
      {
        "title": "Project Proposal Template",
        "description": "Professional project proposal template with sections for scope, timeline, and budget.",
        "type": "DOC",
        "category": "Template",
        "file_url": "#",
        "size": "945 KB",
      },
      {
        "title": "CSS Animation Examples",
        "description": "Collection of CSS animation code snippets and implementation examples.",
        "type": "CODE",
        "category": "Reference",
        "file_url": "#",
        "size": "320 KB",
      },
      {
        "title": "Brand Guidelines",
        "description": "Complete brand identity guidelines including logo usage, colors, and typography.",
        "type": "PDF",
        "category": "Design",
        "file_url": "#",
        "size": "8.1 MB",
      },
    ]

    for d_data in documents_data:
        Document.objects.get_or_create(title=d_data['title'], defaults=d_data)
        print(f"Seeded Document: {d_data['title']}")

if __name__ == '__main__':
    seed_projects()
    seed_documents()
