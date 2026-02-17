import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    CheckCircle2,
    ArrowLeft,
    Loader2,
    CreditCard,
    Wallet,
    Landmark,
    ShieldCheck
} from "lucide-react";
import { toast } from "sonner";

const paymentMethods = [
    { id: "card", name: "Credit / Debit Card", icon: CreditCard },
    { id: "upi", name: "UPI / QR Code", icon: Wallet },
    { id: "netbanking", name: "Net Banking", icon: Landmark },
];

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const plan = searchParams.get("plan") || "growth";
    const [selectedMethod, setSelectedMethod] = useState("card");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const price = plan === "starter" ? "₹49,999" : plan === "growth" ? "₹99,999" : "Custom";

    // Auto-scroll to top
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate Payment Gateway call
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setIsSubmitting(false);
        setIsSuccess(true);
        toast.success("Payment Successful! Welcome to Zyero.");
    };

    if (isSuccess) {
        return (
            <Layout>
                <section className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center">
                    <div className="container mx-auto px-8 text-center max-w-2xl">
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-green-500/20">
                            <CheckCircle2 className="w-12 h-12 text-green-500" />
                        </div>
                        <h1 className="text-4xl font-black mb-4">Payment Successful!</h1>
                        <p className="text-xl text-foreground/60 mb-10">
                            Welcome to the Zyero family! Your <span className="text-primary font-bold uppercase">{plan}</span> plan is now active.
                            We've sent the invoice and onboarding details to your email.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild variant="hero" size="xl">
                                <Link to="/">Go to Dashboard</Link>
                            </Button>
                            <Button asChild variant="outline" size="xl">
                                <Link to="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="pt-32 pb-24 bg-muted/30 min-h-screen">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12">
                        {/* Form Side */}
                        <div className="flex-1 space-y-8">
                            <div>
                                <Link to="/pricing" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary mb-6 transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Pricing
                                </Link>
                                <h1 className="text-3xl md:text-4xl font-black mb-2">Checkout & Activate</h1>
                                <p className="text-foreground/60">Provide your details and complete the secure payment to start.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Step 1: Customer Details */}
                                <div className="glass-card p-8 space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                                        Your Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Full Name</label>
                                            <Input required placeholder="John Doe" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Business Email</label>
                                            <Input required type="email" placeholder="john@example.com" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Phone Number</label>
                                            <Input required type="tel" placeholder="+91 XXX XXX XXXX" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold">Company Name</label>
                                            <Input required placeholder="Zyero Real Estate" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold">Additional Requirements (Optional)</label>
                                        <Textarea placeholder="Tell us about your specific locations or project types..." className="bg-muted/50 border-none px-4 py-4 rounded-xl min-h-[100px]" />
                                    </div>
                                </div>

                                {/* Step 2: Payment Method */}
                                <div className="glass-card p-8 space-y-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                                        Payment Method
                                    </h3>
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setSelectedMethod(method.id)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${selectedMethod === method.id
                                                        ? "bg-foreground text-background border-primary shadow-lg"
                                                        : "bg-background border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <method.icon className={`w-5 h-5 ${selectedMethod === method.id ? "text-primary" : "text-foreground/40"}`} />
                                                <span className="text-sm font-bold">{method.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Payment Inputs */}
                                    <div className="pt-4">
                                        {selectedMethod === "card" && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-semibold italic">Card Number</label>
                                                    <Input required placeholder="XXXX XXXX XXXX XXXX" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold italic">Expiry Date</label>
                                                        <Input required placeholder="MM/YY" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-semibold italic">CVV</label>
                                                        <Input required type="password" placeholder="***" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {selectedMethod === "upi" && (
                                            <div className="space-y-4">
                                                <label className="text-sm font-semibold italic">UPI ID</label>
                                                <Input required placeholder="yourname@upi" className="bg-muted/50 border-none px-4 py-6 rounded-xl" />
                                                <p className="text-xs text-foreground/40 text-center">A payment request will be sent to your UPI app</p>
                                            </div>
                                        )}

                                        {selectedMethod === "netbanking" && (
                                            <div className="space-y-4">
                                                <label className="text-sm font-semibold italic">Select Your Bank</label>
                                                <select className="w-full bg-muted/50 border-none px-4 py-4 rounded-xl text-foreground appearance-none outline-none">
                                                    <option>HDFC Bank</option>
                                                    <option>ICICI Bank</option>
                                                    <option>SBI</option>
                                                    <option>Axis Bank</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Action */}
                                <div className="space-y-4">
                                    <Button type="submit" disabled={isSubmitting} variant="hero" size="xl" className="w-full h-16 text-lg">
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                                Authorizing Transaction...
                                            </>
                                        ) : (
                                            `Buy ${price} - Secure Checkout`
                                        )}
                                    </Button>
                                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/40">
                                        <ShieldCheck className="w-4 h-4 text-green-500" />
                                        256-bit SSL Encrypted Secure Transaction
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Order Summary Side */}
                        <div className="lg:w-[400px]">
                            <div className="glass-card p-8 sticky top-32">
                                <h3 className="text-xl font-bold mb-6">Plan Summary</h3>
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground/60 capitalize">{plan} Plan Subscription</span>
                                        <span className="font-bold">{price}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-foreground/60">Setup & Verification Fee</span>
                                        <span className="text-green-500 font-bold">Waived</span>
                                    </div>
                                    <div className="pt-4 border-t border-border flex justify-between items-center">
                                        <span className="font-bold text-lg">Total Amount</span>
                                        <span className="text-primary font-black text-2xl">{price}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Growth Engine Includes:</p>
                                    <ul className="space-y-3">
                                        {["Verified Buyer Leads", "Proprietary AI Verification", "CRM Integration Support", "dedicated Account Manager"].map((item) => (
                                            <li key={item} className="flex items-center gap-2 text-sm text-foreground/70">
                                                <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-8 bg-primary/5 p-4 rounded-2xl">
                                    <p className="text-[11px] text-foreground/60 leading-relaxed text-center">
                                        Your subscription will start immediately upon successful payment. Charges are processed securely by our global payment partners.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
