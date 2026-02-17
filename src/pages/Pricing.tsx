import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const pricingTiers = [
    {
        name: "Starter",
        price: "₹49,999",
        description: "Perfect for individual realtors or small projects just starting out.",
        features: [
            "Verified Buyer Leads (Upto 50)",
            "Basic Facebook/Instagram Ads",
            "Standard Lead Verification",
            "Email Support",
            "Weekly Reports",
        ],
        cta: "Start with Starter",
        popular: false,
    },
    {
        name: "Growth",
        price: "₹5",
        description: "Ideal for growing developers and teams looking to scale predictably.",
        features: [
            "Verified Buyer Leads (Upto 150)",
            "Multi-platform Campaigns",
            "Premium AI Verification",
            "CRM Integration",
            "Priority WhatsApp Support",
            "Detailed Performance Analytics",
        ],
        cta: "Go with Growth",
        popular: true,
    },
    {
        name: "Elite",
        price: "Custom",
        description: "Full-scale acquisition engine for large developers and builders.",
        features: [
            "Unlimited Verified Leads",
            "Dedicated Ad Manager",
            "Appointment Booking System",
            "Landing Page Funnel Creation",
            "Custom CRM API Integration",
            "24/7 Strategic Consulting",
        ],
        cta: "Contact for Elite",
        popular: false,
    },
];

export default function Pricing() {
    return (
        <Layout>
            {/* Hero */}
            <section className="pt-32 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 section-gradient" />
                <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <span className="text-primary text-sm font-semibold uppercase tracking-wider">
                            PRICING PLANS
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
                            Invest in Your <span className="text-gradient">Growth</span>
                        </h1>
                        <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                            Transparent pricing for professional real estate acquisition. No hidden fees, just verified results.
                        </p>
                    </div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="py-24 relative">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {pricingTiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`flex flex-col p-8 rounded-3xl transition-all duration-300 ${tier.popular
                                    ? "bg-foreground text-background scale-105 shadow-2xl relative z-10 border-2 border-primary"
                                    : "glass-card hover:border-primary/50"
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-black">{tier.price}</span>
                                        {tier.price !== "Custom" && (
                                            <span className={tier.popular ? "text-background/60" : "text-foreground/60"}>
                                                /month
                                            </span>
                                        )}
                                    </div>
                                    <p className={tier.popular ? "text-background/70" : "text-foreground/60"}>
                                        {tier.description}
                                    </p>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm">
                                            <div className={`mt-1 p-0.5 rounded-full ${tier.popular ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}>
                                                <Check className="w-3 h-3" />
                                            </div>
                                            <span className={tier.popular ? "text-background/80" : "text-foreground/80"}>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <Button
                                    asChild
                                    variant={tier.popular ? "hero" : "outline"}
                                    size="xl"
                                    className={`w-full ${tier.popular ? "" : "border-primary/20 hover:border-primary hover:bg-primary/5"}`}
                                >
                                    <Link to={`/checkout?plan=${tier.name.toLowerCase()}`}>
                                        {tier.cta}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Link or Mini FAQ */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-8 md:px-16 lg:px-24 text-center">
                    <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                    <p className="text-foreground/60 mb-8 max-w-2xl mx-auto">
                        Have more questions about our pricing or how we deliver leads? Our team is here to help.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button asChild variant="outline" size="lg">
                            <Link to="/contact">Talk to Sales</Link>
                        </Button>
                        <Button asChild variant="hero" size="lg">
                            <Link to="/book-call">Book Setup Call</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
