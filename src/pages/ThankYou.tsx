import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Clock, MessageSquare, Mail, ShieldCheck, Zap, Target } from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const ThankYou = () => {
    const location = useLocation();
    const { date, time } = location.state || {};

    const coveragePoints = [
        {
            icon: <Target className="w-5 h-5 text-primary" />,
            title: "Market Analysis",
            description: "Deep dive into your specific market and current competition."
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-primary" />,
            title: "The Zyero Blueprint",
            description: "How we build a predictable 7-figure listing system for you."
        },
        {
            icon: <Zap className="w-5 h-5 text-primary" />,
            title: "Accelerator Roadmap",
            description: "Exact step-by-step plan to scale your business in the next 90 days."
        }
    ];

    return (
        <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-background">
            <div className="max-w-3xl w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        YOU'RE ALL SET!
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                        Your strategy session has been successfully booked. We're excited to help you scale.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Booking Details */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-card border rounded-3xl p-8 shadow-sm"
                    >
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-primary" />
                            Meeting Details
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                                <Clock className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">When</p>
                                    <p className="font-bold">
                                        {date && time ? `${date} at ${time}` : "Check your email for details"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-2xl">
                                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                <div>
                                    <p className="text-sm text-muted-foreground font-medium">Platform</p>
                                    <p className="font-bold">Video Call (Google Meet/Zoom)</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <p className="text-sm leading-relaxed">
                                <strong className="text-primary">Important:</strong> Please ensure you are in a quiet place with a stable internet connection for our call.
                            </p>
                        </div>
                    </motion.div>

                    {/* Next Steps */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-6"
                    >
                        <div>
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-primary" />
                                Next Steps
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">Check your Inbox</p>
                                        <p className="text-sm text-muted-foreground">We've sent a calendar invitation and meeting link to your email.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold">WhatsApp Confirmation</p>
                                        <p className="text-sm text-muted-foreground">You will receive a reminder on WhatsApp 15 minutes before the call.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <h4 className="font-bold mb-4">What we'll cover:</h4>
                            <ul className="space-y-3">
                                {coveragePoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <div className="mt-1">{point.icon}</div>
                                        <div>
                                            <p className="text-sm font-bold">{point.title}</p>
                                            <p className="text-xs text-muted-foreground">{point.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
