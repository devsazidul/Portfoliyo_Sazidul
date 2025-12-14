import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, Github, Filter, AlertCircle } from "lucide-react";
import type { Project } from "@shared/schema";

const categories = ["All", "Web", "Mobile", "AI", "Design", "Finance"];

const categoryGradients: Record<string, string> = {
  Web: "from-primary to-secondary",
  Mobile: "from-secondary to-accent",
  AI: "from-accent to-neon-cyan",
  Design: "from-neon-pink to-primary",
  Finance: "from-neon-green to-accent",
};

interface ProjectCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

function ProjectCard({ project, index, isVisible }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 10;
    const y = (e.clientY - rect.top - rect.height / 2) / 10;
    setTilt({ x: -y, y: x });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const gradient = categoryGradients[project.category] || "from-primary to-secondary";

  return (
    <Card
      ref={cardRef}
      className={`group relative overflow-visible bg-card/50 backdrop-blur-sm border-primary/10 transition-all duration-500 ${
        isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
      }`}
      style={{
        animationDelay: `${index * 100}ms`,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-8px)`
          : "perspective(1000px) rotateX(0) rotateY(0) translateY(0)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-testid={`card-project-${project.id}`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg`}
      />

      <div className="p-6">
        <div
          className={`w-full h-40 mb-4 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}
        >
          <div className="text-white/80 font-display text-3xl font-bold">
            {project.title.charAt(0)}
          </div>
        </div>

        <Badge
          variant="secondary"
          className="mb-3 text-xs"
          data-testid={`badge-project-category-${project.id}`}
        >
          {project.category}
        </Badge>

        <h3
          className="text-xl font-display font-semibold mb-2 group-hover:text-primary transition-colors"
          data-testid={`text-project-title-${project.id}`}
        >
          {project.title}
        </h3>

        <p
          className="text-sm text-muted-foreground mb-4 line-clamp-2"
          data-testid={`text-project-description-${project.id}`}
        >
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technologies.slice(0, 3).map((tech, idx) => (
            <Badge
              key={tech}
              variant="outline"
              className="text-xs bg-transparent"
              data-testid={`badge-tech-${project.id}-${idx}`}
            >
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="outline" className="text-xs bg-transparent" data-testid={`badge-tech-more-${project.id}`}>
              +{project.technologies.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          {project.link && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              asChild
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-demo-${project.id}`}
              >
                <ExternalLink className="w-4 h-4" />
                Demo
              </a>
            </Button>
          )}
          {project.github && (
            <Button
              size="sm"
              variant="ghost"
              className="gap-1.5"
              asChild
            >
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`link-project-github-${project.id}`}
              >
                <Github className="w-4 h-4" />
                Code
              </a>
            </Button>
          )}
        </div>
      </div>

      {isHovered && (
        <div
          className={`absolute -inset-1 bg-gradient-to-br ${gradient} rounded-xl opacity-20 blur-xl -z-10 transition-opacity duration-500`}
        />
      )}
    </Card>
  );
}

function ProjectSkeleton() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
      <div className="p-6">
        <Skeleton className="w-full h-40 mb-4 rounded-lg" />
        <Skeleton className="w-16 h-5 mb-3 rounded-full" />
        <Skeleton className="w-3/4 h-6 mb-2" />
        <Skeleton className="w-full h-4 mb-1" />
        <Skeleton className="w-2/3 h-4 mb-4" />
        <div className="flex gap-1.5 mb-4">
          <Skeleton className="w-14 h-5 rounded-full" />
          <Skeleton className="w-14 h-5 rounded-full" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="w-20 h-8 rounded-md" />
          <Skeleton className="w-20 h-8 rounded-md" />
        </div>
      </div>
    </Card>
  );
}

export function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: projects = [], isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-24 md:py-32 relative overflow-hidden bg-muted/30"
      data-testid="section-projects"
    >
      <div className="absolute inset-0 gradient-bg-hero opacity-20" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 ${
              isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
            }`}
            data-testid="text-projects-title"
          >
            Featured <span className="gradient-text-vibrant">Projects</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
              isVisible ? "opacity-100 animate-fade-in-up animation-delay-100" : "opacity-0"
            }`}
          >
            Explore my latest work across different domains
          </p>
        </div>

        <div
          className={`flex flex-wrap items-center justify-center gap-2 mb-12 ${
            isVisible ? "opacity-100 animate-fade-in-up animation-delay-200" : "opacity-0"
          }`}
        >
          <Filter className="w-4 h-4 text-muted-foreground mr-2" />
          {categories.map((category) => (
            <Button
              key={category}
              size="sm"
              variant={activeCategory === category ? "default" : "ghost"}
              className={`rounded-full ${
                activeCategory === category
                  ? "bg-gradient-to-r from-primary to-secondary"
                  : ""
              }`}
              onClick={() => setActiveCategory(category)}
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground">
              Failed to load projects. Please try again later.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}

        {!isLoading && !error && filteredProjects.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No projects found in this category.
          </div>
        )}
      </div>
    </section>
  );
}
