import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />

      {/* Abstract Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-background/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-background/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-32 h-32 border-4 border-background/10 rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-20 h-20 bg-background/5 rotate-45" />

      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground mb-6 max-w-3xl mx-auto">
          Ready to Scale Your Real Estate Business?
        </h2>
        <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
          Book a 15-minute strategy call and discover how Zyero Lead can
          transform your buyer acquisition.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="xl"
            className="bg-background text-foreground hover:bg-background/90 btn-neumorphic"
          >
            <Link to="/calendar-call">
              <Phone className="w-5 h-5" />
              Book a Strategy Call
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
