import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { User, Code2, FileText, Users } from "lucide-react";
import type { PersonalInfo } from "@shared/schema";

const personalInfo: PersonalInfo = {
  name: "Alex Developer",
  title: "Full-Stack Developer & Designer",
  bio: "I'm a passionate developer with expertise in building modern web applications. I love creating beautiful, functional, and user-friendly interfaces that make a difference. With years of experience in both frontend and backend development, I bring ideas to life through clean code and thoughtful design.",
  email: "alex@example.com",
  location: "San Francisco, CA",
  phone: "+1 (555) 123-4567",
  skills: [
    "React", "TypeScript", "Node.js", "Python", "PostgreSQL",
    "Tailwind CSS", "Next.js", "GraphQL", "AWS", "Docker",
    "Figma", "UI/UX Design"
  ],
  stats: {
    yearsExperience: 8,
    projectsCompleted: 50,
    documentsShared: 100,
    happyClients: 30,
  },
  social: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    dribbble: "https://dribbble.com",
  },
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  delay: number;
}

function StatCard({ icon, value, label, delay }: StatCardProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += stepValue;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, delay]);

  return (
    <Card
      ref={ref}
      className="p-6 text-center card-3d bg-card/50 backdrop-blur-sm border-primary/10"
      data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20">
        {icon}
      </div>
      <div className="stats-number mb-2">{count}+</div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </Card>
  );
}

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-24 md:py-32 relative overflow-hidden"
      data-testid="section-about"
    >
      <div className="absolute inset-0 gradient-bg-hero opacity-30" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 ${
              isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
            }`}
            data-testid="text-about-title"
          >
            About <span className="gradient-text-vibrant">Me</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
              isVisible ? "opacity-100 animate-fade-in-up animation-delay-100" : "opacity-0"
            }`}
          >
            Get to know the person behind the code
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div
            className={`${
              isVisible ? "opacity-100 animate-fade-in-left" : "opacity-0"
            }`}
          >
            <div className="relative">
              <div className="w-full aspect-square max-w-md mx-auto rounded-2xl overflow-hidden gradient-border">
                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-br from-secondary to-accent opacity-50 blur-2xl animate-pulse-glow" />
              <div className="absolute -top-4 -left-4 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary opacity-50 blur-2xl animate-pulse-glow animation-delay-500" />
            </div>
          </div>

          <div
            className={`${
              isVisible ? "opacity-100 animate-fade-in-right" : "opacity-0"
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-display font-bold mb-2" data-testid="text-about-name">
              {personalInfo.name}
            </h3>
            <p className="text-lg text-primary font-medium mb-6" data-testid="text-about-title-role">
              {personalInfo.title}
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8" data-testid="text-about-bio">
              {personalInfo.bio}
            </p>

            <div className="mb-8">
              <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Skills & Technologies
              </h4>
              <div className="flex flex-wrap gap-2">
                {personalInfo.skills.map((skill, index) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className={`skill-tag opacity-0 ${
                      isVisible ? "animate-scale-in" : ""
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    data-testid={`badge-skill-${skill.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Code2 className="w-6 h-6 text-primary" />}
            value={personalInfo.stats.yearsExperience}
            label="Years Experience"
            delay={0}
          />
          <StatCard
            icon={<FileText className="w-6 h-6 text-secondary" />}
            value={personalInfo.stats.projectsCompleted}
            label="Projects Completed"
            delay={100}
          />
          <StatCard
            icon={<FileText className="w-6 h-6 text-accent" />}
            value={personalInfo.stats.documentsShared}
            label="Documents Shared"
            delay={200}
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-neon-green" />}
            value={personalInfo.stats.happyClients}
            label="Happy Clients"
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}
