import { 
  type User, type InsertUser,
  type Project, type InsertProject,
  type Document, type InsertDocument,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProjects(): Promise<Project[]>;
  getProjectById(id: string): Promise<Project | undefined>;
  getProjectsByCategory(category: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  getDocuments(): Promise<Document[]>;
  getDocumentById(id: string): Promise<Document | undefined>;
  getDocumentsByCategory(category: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private documents: Map<string, Document>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.documents = new Map();
    this.contactMessages = new Map();
    
    this.seedData();
  }

  private seedData() {
    const sampleProjects: Project[] = [
      {
        id: "1",
        title: "E-Commerce Platform",
        description: "A full-featured online store with payment integration, inventory management, and real-time analytics.",
        category: "Web",
        image: "",
        technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
        link: "https://example.com",
        github: "https://github.com",
      },
      {
        id: "2",
        title: "AI Chat Application",
        description: "Real-time chat application powered by AI with natural language processing and sentiment analysis.",
        category: "AI",
        image: "",
        technologies: ["Python", "TensorFlow", "React", "WebSocket"],
        link: "https://example.com",
        github: "https://github.com",
      },
      {
        id: "3",
        title: "Dashboard Analytics",
        description: "Interactive data visualization dashboard with real-time metrics and customizable widgets.",
        category: "Design",
        image: "",
        technologies: ["TypeScript", "D3.js", "Next.js", "GraphQL"],
        link: "https://example.com",
        github: "https://github.com",
      },
      {
        id: "4",
        title: "Mobile Fitness App",
        description: "Cross-platform fitness tracking application with workout plans and progress monitoring.",
        category: "Mobile",
        image: "",
        technologies: ["React Native", "Firebase", "Redux", "Node.js"],
        link: "https://example.com",
        github: "https://github.com",
      },
      {
        id: "5",
        title: "SaaS Project Manager",
        description: "Collaborative project management tool with Kanban boards, time tracking, and team communication.",
        category: "Web",
        image: "",
        technologies: ["Vue.js", "Express", "MongoDB", "Socket.io"],
        link: "https://example.com",
        github: "https://github.com",
      },
      {
        id: "6",
        title: "Crypto Portfolio Tracker",
        description: "Real-time cryptocurrency portfolio tracking with price alerts and market analysis.",
        category: "Finance",
        image: "",
        technologies: ["React", "Node.js", "WebSocket", "Charts.js"],
        link: "https://example.com",
        github: "https://github.com",
      },
    ];

    const sampleDocuments: Document[] = [
      {
        id: "1",
        title: "React Best Practices Guide",
        description: "Comprehensive guide covering React patterns, performance optimization, and modern development practices.",
        type: "PDF",
        category: "Guide",
        fileUrl: "#",
        size: "2.4 MB",
      },
      {
        id: "2",
        title: "API Documentation Template",
        description: "Professional API documentation template with interactive examples and code snippets.",
        type: "DOC",
        category: "Template",
        fileUrl: "#",
        size: "1.8 MB",
      },
      {
        id: "3",
        title: "TypeScript Cheat Sheet",
        description: "Quick reference guide for TypeScript types, generics, and utility functions.",
        type: "PDF",
        category: "Reference",
        fileUrl: "#",
        size: "856 KB",
      },
      {
        id: "4",
        title: "UI Component Library",
        description: "Design system documentation with color palettes, typography, and component specifications.",
        type: "PDF",
        category: "Design",
        fileUrl: "#",
        size: "5.2 MB",
      },
      {
        id: "5",
        title: "Database Schema Designs",
        description: "Collection of database schema designs and ER diagrams for common application patterns.",
        type: "XLS",
        category: "Technical",
        fileUrl: "#",
        size: "1.2 MB",
      },
      {
        id: "6",
        title: "Project Proposal Template",
        description: "Professional project proposal template with sections for scope, timeline, and budget.",
        type: "DOC",
        category: "Template",
        fileUrl: "#",
        size: "945 KB",
      },
      {
        id: "7",
        title: "CSS Animation Examples",
        description: "Collection of CSS animation code snippets and implementation examples.",
        type: "CODE",
        category: "Reference",
        fileUrl: "#",
        size: "320 KB",
      },
      {
        id: "8",
        title: "Brand Guidelines",
        description: "Complete brand identity guidelines including logo usage, colors, and typography.",
        type: "PDF",
        category: "Design",
        fileUrl: "#",
        size: "8.1 MB",
      },
    ];

    sampleProjects.forEach(p => this.projects.set(p.id, p));
    sampleDocuments.forEach(d => this.documents.set(d.id, d));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProjectById(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByCategory(category: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(p => p.category === category);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }

  async getDocumentById(id: string): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async getDocumentsByCategory(category: string): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(d => d.category === category);
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const id = randomUUID();
    const document: Document = { ...insertDocument, id };
    this.documents.set(id, document);
    return document;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = { ...insertMessage, id };
    this.contactMessages.set(id, message);
    return message;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
}

export const storage = new MemStorage();
