import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Clock, Loader2, ArrowLeft, ArrowRight, Calendar as CalendarIcon, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const timeSlots = [
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
];

export default function BookCalendar() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [sundayEnabled, setSundayEnabled] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        dealsClosed: "",
        clientSourcing: "",
        targetMarket: "",
        role: "",
        company: ""
    });

    const bookingSectionRef = useRef<HTMLDivElement>(null);

    const scrollToBooking = () => {
        bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "phone") {
            const cleaned = value.replace(/\D/g, "").slice(0, 10);
            setFormData(prev => ({ ...prev, [name]: cleaned }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBookingClick = () => {
        if (!date || !selectedTime) {
            toast({
                title: "Please select a date and time",
                variant: "destructive",
            });
            return;
        }

        // Aggressive background sync: Refresh availability while user is filling the form
        fetchBookingsForDate(date, true);

        setShowDetailsForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.phone || !formData.email) {
            toast({
                title: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (formData.phone.length !== 10) {
            toast({
                title: "Invalid Phone Number",
                description: "Please enter a valid 10-digit mobile number.",
                variant: "destructive",
            });
            return;
        }

        // Email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast({
                title: "Invalid Email Address",
                description: "Please enter a valid email address to receive booking confirmation.",
                variant: "destructive",
            });
            return;
        }

        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Cache to store slots per date to make switching instant
    // Using a ref to persist across renders without triggering re-renders itself
    const slotsCache = useRef<Record<string, { slots: string[], timestamp: number }>>({});
    const sessionBookedSlots = useRef<Record<string, string[]>>({});
    const abortControllerRef = useRef<AbortController | null>(null);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxP7yQPYNxUxu_w2sFXl3JaD1zTpOkOHuhpAUiC8YbrSjVLsrg744y_7ePHELkOzZNzw/exec";

    const fetchBookingsForDate = async (dateObj: Date, isBackground = false) => {
        const dateStr = format(dateObj, "yyyy-MM-dd");

        // Cancel previous request if it's still running
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}&_=${Date.now()}`, {
                signal: abortControllerRef.current.signal
            });
            if (!response.ok) throw new Error("Network error while checking slots");
            const data = await response.json();

            if (data.bookedTimes && Array.isArray(data.bookedTimes)) {
                // Update cache
                slotsCache.current[dateStr] = {
                    slots: data.bookedTimes,
                    timestamp: Date.now()
                };

                // If this is the currently selected date, update the UI
                if (date && format(date, "yyyy-MM-dd") === dateStr) {
                    const localForDate = sessionBookedSlots.current[dateStr] || [];
                    const combined = Array.from(new Set([...localForDate, ...data.bookedTimes]));
                    setBookedSlots(combined);
                }
                return data.bookedTimes;
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return null; // Ignore aborted requests
            }
            console.error(`Failed to fetch slots for ${dateStr}`, error);
            if (!isBackground) {
                toast({
                    title: "Availability Sync Error",
                    description: "Could not fetch current availability. Please refresh.",
                    variant: "destructive"
                });
            }
        } finally {
            // Clean up if this was the current controller
            if (abortControllerRef.current?.signal.aborted === false) {
                abortControllerRef.current = null;
            }
        }
        return null;
    };

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getSettings`);
                const data = await response.json();
                if (data.allowSundays !== undefined) {
                    setSundayEnabled(data.allowSundays);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const poll = async () => {
            if (date) {
                await fetchBookingsForDate(date, true);
                timeoutId = setTimeout(poll, 1000); // Recursive polling
            }
        };

        if (date) {
            const dateStr = format(date, "yyyy-MM-dd");
            const cached = slotsCache.current[dateStr];

            if (cached) {
                const localForDate = sessionBookedSlots.current[dateStr] || [];
                setBookedSlots(Array.from(new Set([...localForDate, ...cached.slots])));
                fetchBookingsForDate(date, true);
            } else {
                fetchBookingsForDate(date);
            }

            poll(); // Start polling

            // Prefetch next 3 days
            const today = new Date();
            for (let i = 1; i <= 3; i++) {
                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + i);
                if (nextDate >= today && nextDate.getDay() !== 0) {
                    const nextDateStr = format(nextDate, "yyyy-MM-dd");
                    if (!slotsCache.current[nextDateStr]) {
                        fetchBookingsForDate(nextDate, true);
                    }
                }
            }
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            // THE "DOUBLE-CHECK": One final ultra-fast check before submmitting
            if (date && selectedTime) {
                const latestBookedAtServer = await fetchBookingsForDate(date, true);
                const normalizeTime = (t: string) => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '');

                if (latestBookedAtServer) {
                    const isTakenNow = latestBookedAtServer.some(s => normalizeTime(s) === normalizeTime(selectedTime));
                    if (isTakenNow) {
                        setIsSubmitting(false);
                        setShowDetailsForm(false);
                        setSelectedTime(null);
                        toast({
                            title: "Slot Recently Taken",
                            description: "Sorry, someone else just booked this slot. Please choose another time.",
                            variant: "destructive",
                        });
                        return;
                    }
                }
            }

            const fullDetails = `Deals: ${formData.dealsClosed} | Sourcing: ${formData.clientSourcing} | Market: ${formData.targetMarket} | Role: ${formData.role}`;
            const enhancedCompany = formData.company ? `${formData.company} | ${fullDetails}` : fullDetails;

            const payload = {
                ...formData,
                phone: formData.phone,
                company: enhancedCompany,
                description: fullDetails,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: selectedTime,
                created_at: new Date().toISOString()
            };

            // Fire and forget the fetch request so the user doesn't have to wait for slow Google Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            }).catch(error => {
                console.error("Background booking catch error:", error);
            });

            // Update local state immediately for instant feedback
            if (date && selectedTime) {
                const dateStr = format(date, "yyyy-MM-dd");
                const current = sessionBookedSlots.current[dateStr] || [];
                sessionBookedSlots.current[dateStr] = [...current, selectedTime];

                if (slotsCache.current[dateStr]) {
                    slotsCache.current[dateStr].slots = [...slotsCache.current[dateStr].slots, selectedTime];
                }
                setBookedSlots(prev => [...prev, selectedTime]);
            }

            toast({
                title: "Booking Confirmed!",
                description: "We have added it to our calendar. See you then!",
            });

            // INTANT-ish REDIRECT - 1s delay for better feel as requested
            setTimeout(() => {
                navigate("/thank-you", {
                    state: {
                        date: date ? format(date, "PPPP") : "",
                        time: selectedTime
                    }
                });
            }, 1000);

        } catch (error) {
            console.error("Booking caught error:", error);
            setIsSubmitting(false);
            toast({
                title: "Submission Error",
                description: "There was a problem starting your booking. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        setShowDetailsForm(false);
        setStep(1);
    }

    if (showDetailsForm) {
        return (
            <div className="min-h-screen bg-background p-4 md:p-8 animate-in fade-in duration-500">
                <div className="max-w-3xl mx-auto">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        className="mb-8 hover:bg-muted transition-colors rounded-full px-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Selection
                    </Button>

                    <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                        
                        <div className="mb-10 p-6 bg-primary/5 rounded-2xl border border-primary/10 space-y-3">
                            <h3 className="text-xl font-black flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                Why Zyero?
                            </h3>
                            <p className="text-muted-foreground font-medium leading-relaxed">
                                Zyero Lead specializes in delivering <span className="text-foreground font-bold">verified, high-intent buyer leads</span> for real estate developers and brokers. 
                                We help you build predictable listing systems that work 24/7, eliminating wasted ad spend and unqualified leads.
                            </p>
                        </div>

                        <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">!</div>
                            <p className="text-sm font-medium text-red-800 leading-tight">
                                This call is for serious professionals looking to build a predictable listing system.
                            </p>
                        </div>

                        <div className="mb-10">
                            <h2 className="text-3xl font-black mb-2">Your Details</h2>
                            <p className="text-muted-foreground">
                                {step === 1 ? (
                                    <>
                                        Booking for{" "}
                                        {date && selectedTime && (
                                            <span className="font-bold text-primary">
                                                {format(date, "MMMM do")} @ {selectedTime}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    "Almost done! Just a few more questions."
                                )}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {step === 1 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-3">
                                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            className="h-14 text-lg rounded-xl"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone *</Label>
                                        <div className="flex gap-0 group">
                                            <div className="h-14 px-5 flex items-center justify-center bg-muted border border-r-0 border-input rounded-l-xl font-bold text-muted-foreground shrink-0 group-focus-within:border-primary transition-colors">
                                                +91
                                            </div>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                required
                                                type="tel"
                                                className="h-14 text-lg rounded-l-none rounded-r-xl"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            required
                                            type="email"
                                            className="h-14 text-lg rounded-xl"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
                                        onClick={handleNextStep}
                                    >
                                        Continue
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">How many deals have you closed this year? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, dealsClosed: value }))}
                                            value={formData.dealsClosed}
                                        >
                                            <SelectTrigger className="h-14 text-lg rounded-xl">
                                                <SelectValue placeholder="Select deals" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="0">0</SelectItem>
                                                <SelectItem value="1-3">1-3</SelectItem>
                                                <SelectItem value="3-5">3-5</SelectItem>
                                                <SelectItem value="5-10">5-10</SelectItem>
                                                <SelectItem value="10+">10+</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">How are you finding clients now? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, clientSourcing: value }))}
                                            value={formData.clientSourcing}
                                        >
                                            <SelectTrigger className="h-14 text-lg rounded-xl">
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="referrals">Referrals</SelectItem>
                                                <SelectItem value="ads/social media">Ads / Social Media</SelectItem>
                                                <SelectItem value="cold calling">Cold Calling</SelectItem>
                                                <SelectItem value="mix of everthing">Mix of everything</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label htmlFor="targetMarket" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Which city or market do you primarily operate in? *</Label>
                                        <Input
                                            id="targetMarket"
                                            name="targetMarket"
                                            required
                                            className="h-14 text-lg rounded-xl"
                                            value={formData.targetMarket}
                                            onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                                            placeholder="e.g. Mumbai, Navi Mumbai"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What's your role? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                            value={formData.role}
                                        >
                                            <SelectTrigger className="h-14 text-lg rounded-xl">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Real Estate broker">Real Estate Broker</SelectItem>
                                                <SelectItem value="realtor/Agent">Realtor / Agent</SelectItem>
                                                <SelectItem value="Builder/Developer">Builder / Developer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-14 font-bold rounded-xl"
                                            disabled={isSubmitting}
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-[2] h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20" disabled={isSubmitting}>
                                            {isSubmitting ? "Processing..." : "Confirm Booking"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-card rounded-3xl p-6 md:p-12 border border-border shadow-2xl animate-fade-up">
                <div className="text-center mb-12 space-y-8">
                    <div className="space-y-6">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-tight">
                            Generate 10–20 Qualified Buyer Appointments in 90 Days
                        </h1>
                        <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-3xl mx-auto">
                            We help real estate developers build predictable buyer acquisition systems using targeted Meta ads.
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm md:text-base font-bold text-foreground/80">
                        <div className="flex items-center gap-2 bg-muted/80 px-6 py-3 rounded-full border border-border/50">
                            <CheckCircle className="w-5 h-5 text-green-600" /> No broker dependency
                        </div>
                        <div className="flex items-center gap-2 bg-muted/80 px-6 py-3 rounded-full border border-border/50">
                            <CheckCircle className="w-5 h-5 text-green-600" /> Pre-qualified buyers
                        </div>
                        <div className="flex items-center gap-2 bg-muted/80 px-6 py-3 rounded-full border border-border/50">
                            <CheckCircle className="w-5 h-5 text-green-600" /> Consistent site visits
                        </div>
                    </div>

                    <div className="pt-6">
                        <button
                            onClick={scrollToBooking}
                            className="inline-block bg-primary text-primary-foreground px-10 py-5 rounded-full font-black text-xl md:text-2xl shadow-xl shadow-primary/30 hover:scale-105 transition-transform cursor-pointer"
                        >
                            Book Your Free Strategy Call
                        </button>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-primary">
                            The Process
                        </h2>
                        <div className="h-2 w-16 bg-primary mx-auto mt-4 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[4.5rem] left-[15%] right-[15%] h-1 border-t-4 border-dotted border-border/50 z-0" />

                        {[
                            {
                                step: "01",
                                title: "Audit Sources",
                                description: "We Audit Your Current Buyer Sources find where you're losing leads",
                                icon: CalendarIcon,
                            },
                            {
                                step: "02",
                                title: "Ads System",
                                description: "We Build Your Meta Ads System targeted to serious buyers in your area",
                                icon: Clock,
                            },
                            {
                                step: "03",
                                title: "Site Visits",
                                description: "You Get Qualified Site Visits Scalable results without the guesswork",
                                icon: ArrowRight,
                            },
                        ].map((item, idx) => (
                            <div key={idx} className="relative z-10 flex flex-col items-center text-center group">
                                <div className="w-20 h-20 rounded-3xl bg-primary text-primary-foreground flex items-center justify-center mb-8 shadow-xl shadow-primary/25 group-hover:rotate-6 transition-all duration-300">
                                    <item.icon className="w-10 h-10" />
                                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-2xl bg-foreground text-background text-sm font-black flex items-center justify-center border-4 border-card shadow-lg">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black mb-4 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground font-semibold leading-relaxed px-4">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div ref={bookingSectionRef} className="flex flex-col lg:flex-row gap-16 justify-center items-stretch pt-12 border-t border-border">
                    <div className="flex-1 flex flex-col justify-center items-center p-8 bg-muted/30 rounded-3xl border border-border/50">
                         <h3 className="text-xl font-bold mb-6 self-start text-primary uppercase tracking-wider">Step 1: Choose Date</h3>
                        <div className="transform scale-110 md:scale-125 origin-center">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl bg-transparent"
                                disabled={(date) => {
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    const isBeforeToday = date < today;
                                    const isSunday = date.getDay() === 0;
                                    return isBeforeToday || (isSunday && !sundayEnabled);
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-[300px] space-y-8">
                        {date ? (
                            <>
                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-primary uppercase tracking-wider">Step 2: Choose Time</h3>
                                    <div className="flex items-center justify-between bg-card p-4 rounded-2xl border border-border">
                                        <p className="text-lg font-black">
                                            {format(date, "EEEE, MMM do")}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </span>
                                            Live Sync
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 min-h-[200px] content-start">
                                        {timeSlots.map((time) => {
                                            const normalizeTime = (t: string) => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '');
                                            const isTaken = bookedSlots.some(s => normalizeTime(s) === normalizeTime(time));

                                            return (
                                                <Button
                                                    key={time}
                                                    variant={selectedTime === time ? "default" : "outline"}
                                                    size="lg"
                                                    disabled={isTaken}
                                                    className={cn(
                                                        "w-full justify-center font-black transition-all duration-300 h-14 relative rounded-xl text-md",
                                                        selectedTime === time && "ring-4 ring-primary/20 scale-105 shadow-xl",
                                                        isTaken && "opacity-40 line-through border-dashed cursor-not-allowed grayscale bg-muted/50"
                                                    )}
                                                    onClick={() => !isTaken && setSelectedTime(time)}
                                                >
                                                    <Clock className={cn("w-5 h-5 mr-2", selectedTime === time ? "text-primary-foreground" : "text-primary")} />
                                                    {time}
                                                    {isTaken && (
                                                        <span className="absolute -bottom-1 right-2 text-[9px] uppercase font-black text-red-500">
                                                            Booked
                                                        </span>
                                                    )}
                                                </Button>
                                            );
                                        })}
                                        {timeSlots.every(t => bookedSlots.some(s => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '') === s.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, ''))) && (
                                            <div className="col-span-2 text-center py-10 text-muted-foreground bg-orange-50 rounded-2xl border border-orange-100 shadow-inner">
                                                <p className="font-black text-orange-600 text-lg">Fully Booked</p>
                                                <p className="text-sm font-medium">All timings for this date are currently unavailable.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 transform active:scale-95"
                                    disabled={!selectedTime}
                                    onClick={handleBookingClick}
                                >
                                    Proceed to Details
                                    <ArrowRight className="w-6 h-6 ml-3" />
                                </Button>
                                <p className="text-center text-sm font-bold text-muted-foreground/60">
                                    Trusted by 50+ Real Estate Developers
                                </p>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-12 border-4 border-dotted border-border/50 rounded-3xl bg-muted/10">
                                <CalendarIcon className="w-16 h-16 mb-6 opacity-30 animate-pulse text-primary" />
                                <h4 className="text-xl font-black text-foreground/70">Pick a Date</h4>
                                <p className="font-medium mt-2">To see our available strategy call slots</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <p className="mt-12 text-sm text-muted-foreground/50 font-medium">
                © 2026 Zyero Lead Accelerator. All rights reserved.
            </p>
        </div>
    );
}
