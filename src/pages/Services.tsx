import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Shield, Workflow, CalendarCheck, Layers, BarChart3, CheckCircle } from "lucide-react";

const services = [
  {
    icon: Target,
    title: "Buyer Lead Acquisition",
    description: "We run precision-targeted campaigns across Facebook, Google, and Instagram to capture high-intent property buyers actively searching for homes.",
    features: [
      "Multi-platform ad campaigns",
      "Geo-targeted to your project locations",
      "Budget-specific audience targeting",
      "Property type filtering (1BHK, 2BHK, Villas, Plots)",
    ],
  },
  {
    icon: Shield,
    title: "Lead Verification System",
    description: "Our proprietary AI + human verification ensures every lead is genuine. We verify phone numbers, confirm buying intent, and qualify budget ranges.",
    features: [
      "Phone number verification",
      "Intent qualification calls",
      "Budget range confirmation",
      "Duplicate removal & fraud detection",
    ],
  },
  {
    icon: Workflow,
    title: "CRM Integration & Automation",
    description: "Seamless integration with your existing CRM. Leads flow directly into your sales pipeline with all qualification data included.",
    features: [
      "Salesforce, HubSpot, Zoho integration",
      "Real-time lead push",
      "Custom field mapping",
      "API access for custom solutions",
    ],
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking",
    description: "Our team can pre-book site visits and sales appointments, so your team only meets ready-to-buy prospects.",
    features: [
      "Discovery calls with leads",
      "Calendar syncing with your team",
      "Reminder automation",
      "No-show follow-up handling",
    ],
  },
  {
    icon: Layers,
    title: "Funnel Building",
    description: "We create high-converting landing pages and lead capture funnels designed specifically for real estate buyer acquisition.",
    features: [
      "Mobile-optimized landing pages",
      "A/B tested form designs",
      "WhatsApp integration",
      "Lead magnet development",
    ],
  },
  {
    icon: BarChart3,
    title: "Campaign Management",
    description: "End-to-end campaign management including strategy, creative development, optimization, and detailed reporting.",
    features: [
      "Weekly performance reports",
      "Creative refresh cycles",
      "Budget optimization",
      "Dedicated account manager",
    ],
  },
];

export default function Services() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              End-to-End{" "}
              <span className="text-gradient">Lead Acquisition</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              From targeting to verification to appointment booking we handle
              every step of your buyer acquisition journey.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="glass-card p-8 hover-lift"
              >
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                    <service.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                    <p className="text-foreground/60 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-foreground/70">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              How We Work Together
            </h2>
            <p className="text-foreground/60">
              A simple, proven process that delivers results from day one.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Discovery Call", desc: "We learn about your projects and target buyers" },
              { step: "02", title: "Strategy Design", desc: "We create a custom acquisition strategy" },
              { step: "03", title: "Campaign Launch", desc: "We launch and optimize your campaigns" },
              { step: "04", title: "Lead Delivery", desc: "Verified leads flow to your CRM daily" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-foreground/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-primary-foreground mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book a strategy call and let's discuss how we can help you scale.
          </p>
          <Button
            asChild
            size="xl"
            className="bg-background text-foreground hover:bg-background/90"
          >
            <Link to="/book-call">
              Book Your Call
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
