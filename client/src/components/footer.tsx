import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUp, Github, Linkedin, Twitter, Mail, Heart } from "lucide-react";
import { SiDribbble } from "react-icons/si";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Documents", href: "#documents" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  { icon: SiDribbble, label: "Dribbble", href: "https://dribbble.com" },
];

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="relative py-16 bg-card/50 backdrop-blur-sm border-t border-primary/10" data-testid="footer">
      <div className="absolute inset-0 gradient-bg-hero opacity-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <a
              href="#home"
              className="text-2xl font-display font-bold gradient-text-vibrant mb-4 inline-block"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick("#home");
              }}
              data-testid="link-footer-logo"
            >
              Portfolio
            </a>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Creating beautiful digital experiences with passion and precision.
              Let's build something amazing together.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <Button
                  key={link.label}
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  asChild
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    data-testid={`link-footer-social-${link.label.toLowerCase()}`}
                  >
                    <link.icon className="w-5 h-5" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    data-testid={`link-footer-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Subscribe to get updates on my latest projects and articles.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background/50 border-primary/10"
                data-testid="input-newsletter-email"
              />
              <Button
                type="submit"
                size="icon"
                className="bg-gradient-to-r from-primary to-secondary rounded-full"
                data-testid="button-newsletter-submit"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-primary/10">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Alex Developer
          </p>

          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>

          <Button
            size="icon"
            variant="outline"
            className="rounded-full border-primary/20"
            onClick={scrollToTop}
            data-testid="button-scroll-to-top"
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
