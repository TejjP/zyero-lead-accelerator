import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, IndianRupee, Calendar } from "lucide-react";

const caseStudies = [
  {
    title: "42 Verified 2BHK Buyer Leads in 14 Days",
    client: "Skyline Developers, Mumbai",
    challenge: "Struggling to generate quality leads for their new 2BHK apartment project in Thane.",
    solution: "Implemented precision-targeted Facebook and Google campaigns with our AI verification system.",
    results: [
      { metric: "42", label: "Verified Leads" },
      { metric: "14", label: "Days" },
      { metric: "₹892", label: "Cost Per Lead" },
      { metric: "28%", label: "Site Visit Rate" },
    ],
    testimonial: "Zyero Lead transformed our lead quality. Every lead was genuinely interested and verified. Our sales team is finally productive.",
    clientName: "Rajesh Kumar",
    clientRole: "Director, Skyline Developers",
  },
  {
    title: "21 Plot Buyer Leads at ₹35 CPL",
    client: "GreenField Estates, Pune",
    challenge: "High cost per lead (₹150+) with low verification rates for their plotted development project.",
    solution: "Redesigned targeting strategy focusing on NRI investors and local first-time plot buyers.",
    results: [
      { metric: "21", label: "Verified Leads" },
      { metric: "₹35", label: "Cost Per Lead" },
      { metric: "95%", label: "Verification Rate" },
      { metric: "4x", label: "ROI Improvement" },
    ],
    testimonial: "We reduced our CPL by 77% while improving lead quality dramatically. The ROI has been incredible.",
    clientName: "Amit Patel",
    clientRole: "Marketing Head, GreenField Estates",
  },
  {
    title: "31% Conversion Rate Increase",
    client: "Urban Homes, Bangalore",
    challenge: "Low conversion rates from leads to site visits despite decent lead volume.",
    solution: "Implemented our appointment booking service and landing page optimization.",
    results: [
      { metric: "31%", label: "Conversion Increase" },
      { metric: "45", label: "Appointments/Month" },
      { metric: "50%", label: "Time Saved" },
      { metric: "₹2.3Cr", label: "Pipeline Value" },
    ],
    testimonial: "The appointment booking service changed everything. Our team now only meets serious, qualified buyers.",
    clientName: "Sneha Reddy",
    clientRole: "Sales Manager, Urban Homes",
  },
  {
    title: "3x Pipeline Growth in 90 Days",
    client: "VK Builders, Hyderabad",
    challenge: "Inconsistent lead flow and inability to scale marketing without sacrificing quality.",
    solution: "Full-stack implementation including CRM integration, multi-channel campaigns, and weekly optimization.",
    results: [
      { metric: "3x", label: "Pipeline Growth" },
      { metric: "150+", label: "Leads/Month" },
      { metric: "92%", label: "Lead Quality Score" },
      { metric: "₹8.5Cr", label: "Sales Attributed" },
    ],
    testimonial: "Zyero Lead gave us the predictable lead flow we needed to scale confidently. Best investment we've made.",
    clientName: "Vikram Singh",
    clientRole: "Founder, VK Builders",
  },
];

export default function CaseStudies() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Case Studies
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Real Results for{" "}
              <span className="text-gradient">Real Estate</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              See how we've helped builders and developers across India achieve
              measurable, scalable growth.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Users, metric: "50+", label: "Clients Served" },
              { icon: TrendingUp, metric: "20K+", label: "Leads Delivered" },
              { icon: IndianRupee, metric: "94%", label: "Verification Rate" },
              { icon: Calendar, metric: "72hrs", label: "Avg. First Lead" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-3xl font-black text-primary">{stat.metric}</p>
                <p className="text-sm text-foreground/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <div
                key={study.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                  }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                    {study.client}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-black mt-2 mb-4">
                    {study.title}
                  </h2>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="font-semibold mb-1">Challenge</h4>
                      <p className="text-foreground/60">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Solution</h4>
                      <p className="text-foreground/60">{study.solution}</p>
                    </div>
                  </div>

                  <div className="glass-card p-6 mb-6">
                    <p className="text-foreground/70 italic mb-4">
                      "{study.testimonial}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                        {study.clientName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{study.clientName}</p>
                        <p className="text-xs text-foreground/50">{study.clientRole}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`glass-card p-8 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <h3 className="font-bold text-lg mb-6 text-center">Results</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {study.results.map((result) => (
                      <div key={result.label} className="text-center p-4 bg-muted/50 rounded-xl">
                        <p className="text-3xl font-black text-primary">{result.metric}</p>
                        <p className="text-sm text-foreground/60 mt-1">{result.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-6">
            Want Results Like These?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can create a success story for your business.
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
