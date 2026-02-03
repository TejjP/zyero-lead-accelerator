import { Target, UserCheck, Send } from "lucide-react";

const steps = [
  {
    icon: Target,
    title: "Target High-Intent Buyers",
    description:
      "We use precision targeting to identify buyers actively searching for properties matching your portfolio.",
    image: "targeting",
  },
  {
    icon: UserCheck,
    title: "Capture & Qualify Leads",
    description:
      "Our AI + human verification system ensures every lead is genuine, verified, and ready to buy.",
    image: "qualify",
  },
  {
    icon: Send,
    title: "Deliver Verified Leads Daily",
    description:
      "Receive a steady stream of qualified buyer leads directly into your CRM, ready for your sales team.",
    image: "deliver",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 section-gradient opacity-50" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
            Your Path to{" "}
            <span className="text-gradient">Predictable Leads</span>
          </h2>
          <p className="text-lg text-foreground/60">
            A simple, proven 3-step process that delivers verified buyer leads
            to your doorstep every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="group relative"
            >
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/30 to-transparent -z-10" />
              )}

              <div className="glass-card p-8 h-full hover-lift">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold shadow-lg">
                  {index + 1}
                </div>

                <div className="pt-4">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-foreground/60 leading-relaxed">
                    {step.description}
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
