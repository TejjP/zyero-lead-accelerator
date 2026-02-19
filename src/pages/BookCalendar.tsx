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
        setStep(2);
    };

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Cache to store slots per date to make switching instant
    // Using a ref to persist across renders without triggering re-renders itself
    const slotsCache = useRef<Record<string, { slots: string[], timestamp: number }>>({});
    const sessionBookedSlots = useRef<Record<string, string[]>>({});

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

    const fetchBookingsForDate = async (dateObj: Date, isBackground = false) => {
        const dateStr = format(dateObj, "yyyy-MM-dd");

        // If not a background fetch, we might want to show a loader if no cache exists
        if (!isBackground && !slotsCache.current[dateStr]) {
            setIsLoadingSlots(true);
        }

        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}&_=${Date.now()}`);
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
            }
        } catch (error) {
            console.error(`Failed to fetch slots for ${dateStr}`, error);
            if (!isBackground) {
                toast({
                    title: "Availability Sync Error",
                    description: "Could not fetch current availability. Please refresh.",
                    variant: "destructive"
                });
            }
        } finally {
            if (!isBackground) {
                setIsLoadingSlots(false);
            }
        }
    };

    useEffect(() => {
        if (date) {
            const dateStr = format(date, "yyyy-MM-dd");
            const cached = slotsCache.current[dateStr];

            // 1. If cached, show immediately
            if (cached) {
                const localForDate = sessionBookedSlots.current[dateStr] || [];
                setBookedSlots(Array.from(new Set([...localForDate, ...cached.slots])));
                setIsLoadingSlots(false);

                // Refresh in background if cache is older than 1 minute
                if (Date.now() - cached.timestamp > 60000) {
                    fetchBookingsForDate(date, true);
                }
            } else {
                // 2. Otherwise fetch with loader
                fetchBookingsForDate(date);
            }

            // 3. Prefetch next 3 days to make future selections instant
            const today = new Date();
            for (let i = 1; i <= 3; i++) {
                const nextDate = new Date(date);
                nextDate.setDate(date.getDate() + i);

                // Don't prefetch past dates or Sundays
                if (nextDate >= today && nextDate.getDay() !== 0) {
                    const nextDateStr = format(nextDate, "yyyy-MM-dd");
                    if (!slotsCache.current[nextDateStr]) {
                        fetchBookingsForDate(nextDate, true);
                    }
                }
            }
        }
    }, [date]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSubmitting(true);

        try {
            const fullDetails = `Deals: ${formData.dealsClosed} | Sourcing: ${formData.clientSourcing} | Market: ${formData.targetMarket} | Role: ${formData.role}`;
            const enhancedCompany = formData.company ? `${formData.company} | ${fullDetails}` : fullDetails;

            const payload = {
                ...formData,
                company: enhancedCompany,
                description: fullDetails,
                date: date ? format(date, "yyyy-MM-dd") : "",
                time: selectedTime,
                created_at: new Date().toISOString()
            };

            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "text/plain",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status === "error") {
                throw new Error(data.message || "Unknown backend error");
            }

            setIsSubmitting(false);

            if (date && selectedTime) {
                const dateStr = format(date, "yyyy-MM-dd");
                const current = sessionBookedSlots.current[dateStr] || [];
                sessionBookedSlots.current[dateStr] = [...current, selectedTime];

                // Also update cache so it reflects the new booking
                if (slotsCache.current[dateStr]) {
                    slotsCache.current[dateStr].slots = [...slotsCache.current[dateStr].slots, selectedTime];
                }

                setBookedSlots(prev => [...prev, selectedTime]);
            }


            toast({
                title: "Booking Confirmed!",
                description: "We have added it to our calendar. See you then!",
            });

            // Redirect to thank you page
            navigate("/thank-you", {
                state: {
                    date: date ? format(date, "PPPP") : "",
                    time: selectedTime
                }
            });

        } catch (error) {
            console.error("Booking caught error:", error);
            setIsSubmitting(false);
            toast({
                title: "Submission Error",
                description: error instanceof Error ? error.message : "Please check your script permissions.",
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
                        <div className="inline-block bg-primary/10 text-primary px-8 py-3 rounded-full font-black text-xl md:text-2xl border border-primary/20 shadow-sm">
                            Book Your Free Strategy Call
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 justify-center items-stretch">
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
                                        <div className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                                            Availability
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 min-h-[200px] content-start">
                                        {isLoadingSlots ? (
                                            <div className="col-span-2 text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary" />
                                                <p className="text-sm">Syncing Live Slots...</p>
                                            </div>
                                        ) : (
                                            <>
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
                                                                "w-full justify-start font-bold transition-all duration-300 h-12 relative",
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
                                            </>
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
                <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl max-h-[90vh] flex flex-col">
                    <div className="h-2 bg-primary shrink-0" />
                    <div className="p-8 overflow-y-auto custom-scrollbar">
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
                                        <Input
                                            id="phone"
                                            name="phone"
                                            required
                                            type="tel"
                                            className="h-12"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91..."
                                        />
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
