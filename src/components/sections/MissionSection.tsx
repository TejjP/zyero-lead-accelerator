import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "Predictable lead flow every single day",
  "Verified buyers ready to schedule site visits",
  "Reduced cost per acquisition by up to 40%",
  "Scale campaigns without quality drop-off",
];

export function MissionSection() {
  return (
    <section className="py-24 bg-foreground text-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Our Mission
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
              Helping real estate businesses scale with{" "}
              <span className="text-primary">predictable buyer acquisition</span>
            </h2>

            <p className="text-background/60 text-lg leading-relaxed">
              Our mission is to help builders, developers & realtors scale using
              predictable, verified buyer acquisition systems that work 24/7.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-background/80">{benefit}</span>
                </div>
              ))}
            </div>

            <Button asChild variant="hero" size="lg">
              <Link to="/about">
                Learn Our Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          <div className="space-y-8">
            <div className="glass-card-dark p-8 border-primary/20">
              <h3 className="text-xl font-bold mb-4 text-background">
                Why We Started Zyero Lead
              </h3>
              <p className="text-background/60 leading-relaxed">
                We witnessed the real estate industry struggle with low-quality
                leads, fake inquiries, and wasted ad spend. Builders were
                spending lakhs on marketing but getting nowhere.
              </p>
              <p className="text-background/60 leading-relaxed mt-4">
                Zyero Lead was born to solve this problem to create a system
                that delivers only verified, high-intent buyer leads that
                actually convert.
              </p>
            </div>

            <div className="glass-card-dark p-8 border-primary/20">
              <h3 className="text-xl font-bold mb-4 text-background">
                The Problem We Solve
              </h3>
              <ul className="space-y-3">
                {[
                  "80% of real estate leads are unqualified or fake",
                  "Sales teams waste hours chasing dead-end inquiries",
                  "Marketing budgets burn without predictable ROI",
                  "Scaling campaigns only increases lead wastage",
                ].map((problem) => (
                  <li
                    key={problem}
                    className="flex items-start gap-3 text-background/60"
                  >
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
