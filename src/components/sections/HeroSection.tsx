import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import heroBg from "@/assets/hero-bg.png";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 section-gradient" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-primary/20 rounded-2xl rotate-12 hidden lg:block" />
      <div className="absolute bottom-1/4 right-20 w-16 h-16 bg-primary/10 rounded-full hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/20 rotate-45 hidden lg:block" />

      <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Content */}
          <div className="space-y-8">
            <div
              className="animate-on-scroll opacity-0"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                India's #1 Real Estate Lead Specialist
              </span>
            </div>

            <h1
              className="animate-on-scroll opacity-0 text-4xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight"
              style={{ animationDelay: "0.2s" }}
            >
              We Acquire Verified Real Estate Buyer Leads{" "}
              <span className="text-gradient">Daily.</span>
            </h1>

            <p
              className="animate-on-scroll opacity-0 text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
              style={{ animationDelay: "0.3s" }}
            >
              Zyero Lead is India's leading Real Estate Buyer Lead Acquisition
              Specialist. We deliver verified, high-intent buyer leads directly
              to your sales team.
            </p>

            <div
              className="animate-on-scroll opacity-0 flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/calendar-call">
                  Book a 15-Min Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="animate-on-scroll opacity-0 flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-border/50"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary">50+</p>
                <p className="text-sm text-foreground/50">Clients Served</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary">20K+</p>
                <p className="text-sm text-foreground/50">Leads Delivered</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary">31%</p>
                <p className="text-sm text-foreground/50">Avg Conversion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
