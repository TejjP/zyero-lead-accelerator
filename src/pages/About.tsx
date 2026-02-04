import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Users, Award, TrendingUp, CheckCircle } from "lucide-react";

const timeline = [
  { year: "2025", title: "Founded", description: "Zyero Lead was born from a vision to fix real estate lead generation." },
  { year: "2025", title: "100 Clients", description: "Reached our first 100 clients across Mumbai and Pune." },
  { year: "2025", title: "20K+ Leads", description: "Crossed 20,000 verified leads delivered with 94% verification rate." },
  { year: "2025", title: "Pan-India", description: "Expanded operations to 8 major cities across India." },
];

const values = [
  { icon: Target, title: "Precision", description: "Every lead we deliver is targeted and verified." },
  { icon: Users, title: "Partnership", description: "We succeed only when our clients succeed." },
  { icon: Award, title: "Excellence", description: "We maintain the highest standards in everything we do." },
  { icon: TrendingUp, title: "Growth", description: "We're obsessed with helping businesses scale." },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              The Story Behind{" "}
              <span className="text-gradient">Zyero Lead</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              We're on a mission to transform how real estate businesses
              acquire verified buyer leads predictably and profitably.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black">
                Why We Started Zyero Lead
              </h2>
              <p className="text-foreground/70 leading-relaxed">
                In 2025, Tej started this agency to help real estate developers and agents get better results from their marketing. Not more leads better ones.
                Most businesses were already running ads, but the enquiries coming in were inconsistent, unfiltered, and difficult to convert. Sales teams spent time chasing calls that went nowhere, and marketing spend rarely matched actual outcomes.
                This agency was built to simplify that process. We focus on practical targeting, basic verification, and lead handling that prioritizes intent over volume so our clients speak to people who are actually considering a purchase.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                Sales teams wasted countless hours chasing dead ends. Marketing budgets
                evaporated without predictable ROI. The industry needed a better way.
              </p>
              <p className="text-foreground/70 leading-relaxed">
                That's when Zyero Lead was born with a singular focus on delivering
                only verified, high-intent buyer leads that actually convert into
                site visits and sales.
              </p>
              <div className="pt-4">
                <Button asChild variant="hero" size="lg">
                  <Link to="/book-call">
                    Work With Us
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="glass-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary text-3xl font-black">
                  T
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tej</h3>
                  <p className="text-foreground/60">Founder & CEO</p>
                </div>
              </div>
              <p className="text-foreground/70 leading-relaxed mb-6">
                "I've spent years in digital marketing for real estate. I've seen
                the waste, the frustration, and the broken promises. Zyero Lead
                is my answer to fixing this one verified lead at a time."
              </p>
              <div className="flex gap-6">
                <div>
                  <p className="text-2xl font-bold text-primary">20k+</p>
                  <p className="text-sm text-foreground/50">Leads Delivered</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">50+</p>
                  <p className="text-sm text-foreground/50">Clients Served</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card p-10">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-foreground/70 leading-relaxed">
                To help builders, developers, and realtors scale their businesses
                using predictable, verified buyer acquisition systems that work
                24/7 eliminating wasted ad spend and unqualified leads forever.
              </p>
            </div>

            <div className="glass-card p-10">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed">
                To become India's most trusted real estate lead acquisition partner,
                known for quality, transparency, and delivering measurable results
                that transform businesses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Values</h2>
            <p className="text-foreground/60">
              The principles that guide everything we do at Zyero Lead.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="glass-card p-6 text-center hover-lift">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-foreground/60">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-foreground text-background">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">Our Journey</h2>
            <p className="text-background/60">
              From a small team with a big vision to India's leading real estate lead specialist.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 -translate-x-1/2" />

              {timeline.map((item, index) => (
                <div
                  key={item.year}
                  className={`relative flex items-center gap-8 mb-12 last:mb-0 ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? "text-right" : "text-left"}`}>
                    <div className="glass-card-dark p-6">
                      <span className="text-primary font-bold text-lg">{item.year}</span>
                      <h3 className="font-bold text-xl mt-2">{item.title}</h3>
                      <p className="text-background/60 mt-2">{item.description}</p>
                    </div>
                  </div>

                  <div className="w-4 h-4 bg-primary rounded-full relative z-10 shrink-0" />

                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-6">
            Ready to Join 50+ Successful Clients?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Start receiving verified buyer leads within 72 hours.
          </p>
          <Button
            asChild
            size="xl"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/book-call">
              Book Your Strategy Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
