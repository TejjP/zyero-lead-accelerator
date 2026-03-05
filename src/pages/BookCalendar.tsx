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
import { Clock, Loader2, ArrowLeft, ArrowRight, Calendar as CalendarIcon } from "lucide-react";
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
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState(1);
    const { toast } = useToast();
    const bookingSectionRef = useRef<HTMLDivElement>(null);

    const scrollToBooking = () => {
        bookingSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        dealsClosed: "",
        clientSourcing: "",
        targetMarket: "",
        role: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "phone") {
            // Only allow digits and max 10 characters
            const cleaned = value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, [name]: cleaned }));
            return;
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
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

        setIsDialogOpen(true);
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
    };

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Cache to store slots per date to make switching instant
    // Using a ref to persist across renders without triggering re-renders itself
    const slotsCache = useRef<Record<string, { slots: string[], timestamp: number }>>({});
    const sessionBookedSlots = useRef<Record<string, string[]>>({});
    const abortControllerRef = useRef<AbortController | null>(null);

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwjkCC-BhexEPQFkH4cptY_0f71vdfI3WCUSEVSLKOq3IGEHFnveYU0P_BFHGULQWAnlA/exec";

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
                        setIsDialogOpen(false);
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

    const handleClose = () => {
        setIsDialogOpen(false);
        setStep(1);
        setFormData({
            name: "",
            email: "",
            phone: "",
            company: "",
            dealsClosed: "",
            clientSourcing: "",
            targetMarket: "",
            role: ""
        });
        setSelectedTime(null);
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-4xl bg-card rounded-3xl p-8 border border-border shadow-2xl animate-fade-up">
                <div className="text-center mb-8 space-y-6">
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
                            Generate 10–20 Qualified Buyer Appointments in 90 Days
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                            We help real estate developers build predictable buyer acquisition systems using targeted Meta ads.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-sm md:text-base font-bold text-foreground/80">
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                            <span className="text-green-600">✔</span> No broker dependency
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                            <span className="text-green-600">✔</span> Pre-qualified buyers
                        </div>
                        <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border/50">
                            <span className="text-green-600">✔</span> Consistent site visits
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={scrollToBooking}
                            className="inline-block bg-primary/10 text-primary px-8 py-3 rounded-full font-black text-xl md:text-2xl border border-primary/20 shadow-sm hover:bg-primary/20 transition-all cursor-pointer"
                        >
                            Book Your Free Strategy Call
                        </button>
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="mb-16">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black uppercase tracking-tight text-foreground/90">
                            How It Works
                        </h2>
                        <div className="h-1.5 w-12 bg-primary mx-auto mt-2 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 border-t-2 border-dashed border-border z-0" />

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
                                <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                                    <item.icon className="w-8 h-8" />
                                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-foreground text-background text-xs font-black flex items-center justify-center border-4 border-card">
                                        {item.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-3 text-foreground">{item.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed px-4">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>


                <div ref={bookingSectionRef} className="flex flex-col lg:flex-row gap-12 justify-center items-stretch">
                    <div className="flex-1 flex justify-center items-center p-4 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="transform scale-110 origin-center">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-xl"
                                disabled={(date) => date < new Date() || date.getDay() === 0}
                            />
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between min-w-[300px] space-y-6">
                        {date ? (
                            <>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold">
                                            {format(date, "EEEE, MMM do")}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
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
                                                        "w-full justify-center font-bold transition-all duration-300 h-12 relative",
                                                        selectedTime === time && "ring-2 ring-primary ring-offset-2 scale-105",
                                                        isTaken && "opacity-50 line-through border-dashed cursor-not-allowed grayscale"
                                                    )}
                                                    onClick={() => !isTaken && setSelectedTime(time)}
                                                >
                                                    <Clock className={cn("w-4 h-4 mr-2", selectedTime === time ? "text-primary-foreground" : "text-primary")} />
                                                    {time}
                                                    {isTaken && (
                                                        <span className="absolute right-2 text-[10px] uppercase tracking-tighter opacity-70">
                                                            Booked
                                                        </span>
                                                    )}
                                                </Button>
                                            );
                                        })}
                                        {timeSlots.every(t => bookedSlots.some(s => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '') === s.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, ''))) && (
                                            <div className="col-span-2 text-center py-8 text-muted-foreground bg-orange-50/50 rounded-xl border border-orange-100">
                                                <p className="font-bold text-orange-600">No Slots Available</p>
                                                <p className="text-xs">All timings are currently blocked or booked.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Button
                                    className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                                    disabled={!selectedTime}
                                    onClick={handleBookingClick}
                                >
                                    Book Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <p className="text-center text-sm font-bold text-muted-foreground/80 mt-4">
                                    No contracts. No retainer. Cancel anytime.
                                </p>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-center p-12 border-2 border-dashed border-border/50 rounded-2xl bg-muted/20">
                                <CalendarIcon className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-semibold">Select a date</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                    <div className="h-2 bg-primary shrink-0" />
                    <div className="p-10 overflow-y-auto custom-scrollbar">
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">!</div>
                            <p className="text-sm font-medium text-red-800 leading-tight">
                                This call is for serious professionals looking to build a predictable listing system.
                            </p>
                        </div>
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-2xl font-black">
                                Your Details
                            </DialogTitle>
                            <DialogDescription className="text-base pt-2">
                                {step === 1 ? (
                                    <>
                                        Booking for{" "}
                                        {date && selectedTime && (
                                            <span className="font-bold text-primary block mt-1">
                                                {format(date, "MMMM do")} @ {selectedTime}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    "Almost done!"
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 1 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            className="h-12"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Phone *</Label>
                                        <div className="flex gap-0">
                                            <div className="h-12 px-4 flex items-center justify-center bg-muted border border-r-0 border-input rounded-l-md font-bold text-muted-foreground shrink-0">
                                                +91
                                            </div>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                required
                                                type="tel"
                                                className="h-12 rounded-l-none"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="98765 43210"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            required
                                            type="email"
                                            className="h-12"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full h-12 font-bold"
                                        onClick={handleNextStep}
                                    >
                                        Continue
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">How many deals have you closed this year? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, dealsClosed: value }))}
                                            value={formData.dealsClosed}
                                        >
                                            <SelectTrigger className="h-12">
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

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">How are you finding clients now? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, clientSourcing: value }))}
                                            value={formData.clientSourcing}
                                        >
                                            <SelectTrigger className="h-12">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="targetMarket" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Which city or market do you primarily operate in? *</Label>
                                        <Input
                                            id="targetMarket"
                                            name="targetMarket"
                                            required
                                            className="h-12"
                                            value={formData.targetMarket}
                                            onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                                            placeholder="e.g. Mumbai, Navi Mumbai"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">What's your role? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                            value={formData.role}
                                        >
                                            <SelectTrigger className="h-12">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Real Estate broker">Real Estate Broker</SelectItem>
                                                <SelectItem value="realtor/Agent">Realtor / Agent</SelectItem>
                                                <SelectItem value="Builder/Developer">Builder / Developer</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="flex-1 h-12"
                                            disabled={isSubmitting}
                                            onClick={() => setStep(1)}
                                        >
                                            Back
                                        </Button>
                                        <Button type="submit" className="flex-[2] h-12 font-bold" disabled={isSubmitting}>
                                            {isSubmitting ? "Processing..." : "Confirm Booking"}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
