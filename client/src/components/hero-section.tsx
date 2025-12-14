import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles } from "lucide-react";

interface FloatingShapeProps {
  className?: string;
  size: number;
  color: string;
  animationClass: string;
  style?: React.CSSProperties;
}

function FloatingShape({ className, size, color, animationClass, style }: FloatingShapeProps) {
  return (
    <div
      className={`floating-shape ${animationClass} ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        ...style,
      }}
    />
  );
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / 50;
        const y = (e.clientY - rect.top - rect.height / 2) / 50;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg-hero"
      data-testid="section-hero"
    >
      <FloatingShape
        size={400}
        color="linear-gradient(135deg, hsl(280 100% 60% / 0.4), hsl(320 100% 60% / 0.4))"
        animationClass="animate-float"
        style={{
          top: "10%",
          left: "10%",
          transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
        }}
      />
      <FloatingShape
        size={300}
        color="linear-gradient(135deg, hsl(200 100% 60% / 0.4), hsl(180 100% 50% / 0.4))"
        animationClass="animate-float-delayed"
        style={{
          top: "60%",
          right: "15%",
          transform: `translate(${mousePosition.x * -1.5}px, ${mousePosition.y * -1.5}px)`,
        }}
      />
      <FloatingShape
        size={200}
        color="linear-gradient(135deg, hsl(330 100% 60% / 0.3), hsl(280 100% 60% / 0.3))"
        animationClass="animate-float-slow"
        style={{
          bottom: "20%",
          left: "20%",
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        }}
      />
      <FloatingShape
        size={150}
        color="linear-gradient(135deg, hsl(160 100% 50% / 0.3), hsl(200 100% 60% / 0.3))"
        animationClass="animate-float"
        style={{
          top: "30%",
          right: "25%",
          transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 animate-spin-slow"
          style={{
            top: "20%",
            right: "10%",
            background: "conic-gradient(from 0deg, transparent, hsl(280 100% 60% / 0.3), transparent)",
          }}
        />
        <div
          className="absolute w-64 h-64 rounded-full opacity-20 animate-spin-slow"
          style={{
            bottom: "30%",
            left: "5%",
            background: "conic-gradient(from 180deg, transparent, hsl(200 100% 60% / 0.3), transparent)",
            animationDirection: "reverse",
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass opacity-0 animate-fade-in-down"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Welcome to my portfolio</span>
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight opacity-0 animate-fade-in-up"
          style={{
            transform: `translate(${mousePosition.x * 0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
          data-testid="text-hero-title"
        >
          <span className="block">Creative</span>
          <span className="gradient-text-vibrant">Developer</span>
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up animation-delay-200"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
          }}
          data-testid="text-hero-subtitle"
        >
          Crafting beautiful digital experiences with cutting-edge technologies.
          Explore my projects, documents, and get in touch!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up animation-delay-400">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-primary to-secondary border-0"
            onClick={() => {
              const projects = document.getElementById("projects");
              if (projects) projects.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-view-work"
          >
            View My Work
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg font-semibold glass border-white/30"
            onClick={() => {
              const contact = document.getElementById("contact");
              if (contact) contact.scrollIntoView({ behavior: "smooth" });
            }}
            data-testid="button-get-in-touch"
          >
            Get In Touch
          </Button>
        </div>
      </div>

      <button
        onClick={scrollToAbout}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 p-3 rounded-full glass animate-bounce-subtle cursor-pointer"
        data-testid="button-scroll-down"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </section>
  );
}
