import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, MapPin, Phone, Send, Loader2, Github, Linkedin, Twitter, Facebook, CheckCircle } from "lucide-react";
import { SiCodeforces, SiDribbble, SiHackerrank, SiLeetcode } from "react-icons/si";
import { insertContactMessageSchema, type InsertContactMessage } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";


const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "rabbiking00@gmail.com",
    href: "mailto:rabbiking00@gmail.com",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Gulsan-1, Dhaka, Bangladesh,",
    href: "#",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+8801999076918",
    href: "tel:+8801999076918",
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/devsazidul" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/md-sazidul-islam-374541212/" },
  { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/sazidulislamrabbi" },
  { icon: SiCodeforces, label: "CodeForce", href: "https://codeforces.com/profile/sazidulislam?csrf_token=9ae236420418bd6cd738b466e0276d6c" },
  { icon: SiLeetcode, label: "LeetCode", href: "https://leetcode.com/u/sazidulislam/" },
  { icon: SiHackerrank, label: "Hackerrank", href: "https://www.hackerrank.com/profile/sazidulislam" },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContactMessage>({
    resolver: zodResolver(insertContactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactMessage) => {
      const response = await apiRequest("POST", "/api/contact/", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: (
          <div className="flex items-center gap-2 text-white">
            <CheckCircle className="h-5 w-5" />
            <span className="font-bold text-lg">Success!</span>
          </div>
        ),
        description: (
          <div className="text-white/90">
            Your message has been sent securely. checks your email for confirmation!
          </div>
        ),
        variant: "success",
        className: "border-green-500 bg-green-600 text-white", // Extra colorful override
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error Sending Message",
        description: "Could not send the message. Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContactMessage) => {
    submitMutation.mutate(data);
  };

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
      id="contact"
      className="py-24 md:py-32 relative overflow-hidden bg-muted/30"
      data-testid="section-contact"
    >
      <div className="absolute inset-0 gradient-bg-hero opacity-30" />

      <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 blur-3xl animate-pulse-glow animation-delay-500" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2
            className={`text-4xl md:text-5xl font-display font-bold mb-4 ${isVisible ? "opacity-100 animate-fade-in-up" : "opacity-0"
              }`}
            data-testid="text-contact-title"
          >
            Get In <span className="gradient-text-vibrant">Touch</span>
          </h2>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto ${isVisible ? "opacity-100 animate-fade-in-up animation-delay-100" : "opacity-0"
              }`}
          >
            Have a project in mind? Let's work together!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card
            className={`p-8 bg-card/50 backdrop-blur-sm border-primary/10 ${isVisible ? "opacity-100 animate-fade-in-left" : "opacity-0"
              }`}
          >
            <h3 className="text-2xl font-display font-semibold mb-6">
              Send a Message
            </h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="bg-background/50 border-primary/10 focus:border-primary"
                            data-testid="input-contact-name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="bg-background/50 border-primary/10 focus:border-primary"
                            data-testid="input-contact-email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What's this about?"
                          className="bg-background/50 border-primary/10 focus:border-primary"
                          data-testid="input-contact-subject"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project..."
                          className="min-h-[150px] bg-background/50 border-primary/10 focus:border-primary resize-none"
                          data-testid="input-contact-message"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  disabled={submitMutation.isPending}
                  data-testid="button-contact-submit"
                >
                  {submitMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </Card>

          <div
            className={`space-y-8 ${isVisible ? "opacity-100 animate-fade-in-right" : "opacity-0"
              }`}
          >
            <div>
              <h3 className="text-2xl font-display font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-primary/10 transition-all duration-300 hover:border-primary/30 hover:translate-x-2"
                    style={{ animationDelay: `${index * 100}ms` }}
                    data-testid={`link-contact-${item.label.toLowerCase()}`}
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {item.label}
                      </div>
                      <div className="font-medium">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-semibold mb-4">
                Follow Me
              </h3>

              <div className="flex items-center gap-3">
                {socialLinks.map((link) => (
                  <Button
                    key={link.label}
                    size="icon"
                    variant="outline"
                    className="rounded-full border-primary/20 hover:border-primary hover:bg-primary/10"
                    asChild
                  >
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      data-testid={`link-social-${link.label.toLowerCase()}`}
                    >
                      <link.icon className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
              <h4 className="font-display font-semibold mb-2">
                Available for freelance work
              </h4>
              <p className="text-sm text-muted-foreground">
                I'm currently accepting new projects. Let's create something
                amazing together!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
