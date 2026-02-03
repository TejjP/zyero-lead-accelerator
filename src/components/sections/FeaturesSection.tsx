import { Crosshair, Shield, Workflow, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: Crosshair,
    title: "Precision Targeting System",
    description:
      "Advanced algorithms identify high-intent buyers based on behavior, demographics, and property preferences.",
  },
  {
    icon: Shield,
    title: "Human + AI Lead Verification",
    description:
      "Every lead goes through our dual verification process to ensure authenticity and buying intent.",
  },
  {
    icon: Workflow,
    title: "CRM Integration & Automation",
    description:
      "Seamless integration with your existing CRM. Leads flow directly into your sales pipeline.",
  },
  {
    icon: CalendarCheck,
    title: "Appointment Booking Support",
    description:
      "Our team can pre-book site visits and appointments, so your sales team only meets ready buyers.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
            Everything You Need to{" "}
            <span className="text-gradient">Scale Sales</span>
          </h2>
          <p className="text-lg text-foreground/60">
            Our comprehensive lead acquisition platform gives you all the tools
            to generate, verify, and convert real estate buyers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass-card p-8 hover-lift cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
