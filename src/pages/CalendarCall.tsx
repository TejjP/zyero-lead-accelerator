import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
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
import { Clock, ArrowRight, Loader2, CheckCircle, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
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

export default function CalendarCall() {
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

    const [showDetailsForm, setShowDetailsForm] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === "phone") {
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
        
        if (formData.phone.length < 10) {
            toast({
                title: "Invalid Phone Number",
                description: "Please enter a valid 10-digit mobile number.",
                variant: "destructive",
            });
            return;
        }

        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const sessionBookedSlots = useRef<Record<string, string[]>>({});

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxP7yQPYNxUxu_w2sFXl3JaD1zTpOkOHuhpAUiC8YbrSjVLsrg744y_7ePHELkOzZNzw/exec";

    useEffect(() => {
        if (date) {
            const fetchBookings = async () => {
                setIsLoadingSlots(true);
                setBookedSlots([]);

                const dateStr = format(date, "yyyy-MM-dd");
                const localForDate = sessionBookedSlots.current[dateStr] || [];
                setBookedSlots([...localForDate]);

                try {
                    const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}&_=${Date.now()}`);
                    if (!response.ok) throw new Error("Network error while checking slots");
                    const data = await response.json();

                    if (data.bookedTimes && Array.isArray(data.bookedTimes)) {
                        const localForDate = sessionBookedSlots.current[dateStr] || [];
                        const combined = Array.from(new Set([...localForDate, ...data.bookedTimes]));
                        setBookedSlots(combined);
                    }
                } catch (error) {
                    console.error("Failed to fetch slots", error);
                    toast({
                        title: "Availability Sync Error",
                        description: "Could not fetch current availability. Please refresh.",
                        variant: "destructive"
                    });
                } finally {
                    setIsLoadingSlots(false);
                }
            };
            fetchBookings();
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
                setBookedSlots(prev => [...prev, selectedTime]);
            }

            toast({
                title: "Booking Confirmed!",
                description: "We have added it to our calendar. See you then!",
            });

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

    const handleBack = () => {
        setShowDetailsForm(false);
        setStep(1);
    }

    if (showDetailsForm) {
        return (
            <Layout>
                <div className="min-h-screen bg-muted/30 py-12 px-4 animate-in fade-in duration-500">
                    <div className="max-w-3xl mx-auto">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            className="mb-8 hover:bg-card transition-all rounded-full px-6 font-bold"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Calendar
                        </Button>

                        <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-3 bg-primary" />
                            
                            <div className="mb-12 p-8 bg-primary/5 rounded-3xl border border-primary/10 space-y-4">
                                <h3 className="text-2xl font-black flex items-center gap-3">
                                    <CheckCircle className="w-6 h-6 text-primary" />
                                    About Zyero
                                </h3>
                                <p className="text-lg text-muted-foreground font-semibold leading-relaxed">
                                    Zyero Lead helps real estate developers build predictable buyer acquisition systems. 
                                    We deliver high-intent, verified buyer leads that actually convert into site visits and sales, 
                                    eliminating the guesswork from your marketing spend.
                                </p>
                            </div>

                            <div className="mb-10 p-5 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-4">
                                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-black mt-0.5 shrink-0">!</div>
                                <p className="text-md font-bold text-red-800 leading-tight">
                                    This call is for serious professionals ready to scale their real estate business.
                                </p>
                            </div>

                            <div className="mb-12">
                                <h2 className="text-4xl font-black mb-3 text-foreground">Finalize Your Call</h2>
                                <p className="text-xl text-muted-foreground font-medium">
                                    {step === 1 ? (
                                        <>
                                            Scheduled for{" "}
                                            {date && selectedTime && (
                                                <span className="font-black text-primary border-b-2 border-primary/20 pb-1">
                                                    {format(date, "MMMM do")} at {selectedTime}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        "Briefly tell us about your experience."
                                    )}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {step === 1 ? (
                                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                        <div className="space-y-3">
                                            <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Full Name *</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                required
                                                className="h-16 text-lg rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="email" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Email Address *</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                className="h-16 text-lg rounded-2xl border-2 focus-visible:ring-primary shadow-sm"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label htmlFor="phone" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Phone Number *</Label>
                                            <div className="flex gap-0 group">
                                               <div className="h-16 px-6 flex items-center justify-center bg-muted border-2 border-r-0 border-input rounded-l-2xl font-black text-muted-foreground group-focus-within:border-primary transition-colors">
                                                   +91
                                               </div>
                                               <Input
                                                   id="phone"
                                                   name="phone"
                                                   type="tel"
                                                   required
                                                   className="h-16 text-lg rounded-l-none rounded-r-2xl border-2 focus-visible:ring-primary shadow-sm"
                                                   value={formData.phone}
                                                   onChange={handleInputChange}
                                                   placeholder="98765 43210"
                                               />
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/30 transform active:scale-95 transition-all mt-4"
                                            onClick={handleNextStep}
                                        >
                                            Next Step <ArrowRight className="w-6 h-6 ml-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                                        <div className="space-y-3">
                                            <Label htmlFor="dealsClosed" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Deals closed this year? *</Label>
                                            <Select
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, dealsClosed: value }))}
                                                value={formData.dealsClosed}
                                            >
                                                <SelectTrigger className="h-16 text-lg rounded-2xl border-2">
                                                    <SelectValue placeholder="Select count" />
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
                                            <Label htmlFor="clientSourcing" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Current client source? *</Label>
                                            <Select
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, clientSourcing: value }))}
                                                value={formData.clientSourcing}
                                            >
                                                <SelectTrigger className="h-16 text-lg rounded-2xl border-2">
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
                                            <Label htmlFor="targetMarket" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">Primary Market/City? *</Label>
                                            <Input
                                                id="targetMarket"
                                                name="targetMarket"
                                                required
                                                className="h-16 text-lg rounded-2xl border-2 shadow-sm"
                                                value={formData.targetMarket}
                                                onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                                                placeholder="e.g. Mumbai"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <Label htmlFor="role" className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">What is your role? *</Label>
                                            <Select
                                                onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                                value={formData.role}
                                            >
                                                <SelectTrigger className="h-16 text-lg rounded-2xl border-2">
                                                    <SelectValue placeholder="Select role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Real Estate broker">Real Estate Broker</SelectItem>
                                                    <SelectItem value="realtor/Agent">Realtor / Agent</SelectItem>
                                                    <SelectItem value="Builder/Developer">Builder / Developer</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="flex-1 h-16 font-black rounded-2xl border-2"
                                                disabled={isSubmitting}
                                                onClick={() => setStep(1)}
                                            >
                                                <ArrowLeft className="w-5 h-5 mr-3" /> Back
                                            </Button>
                                            <Button type="submit" className="flex-[2] h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/30" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    "Confirm Call"
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <section className="py-24 px-4 bg-muted/30 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-fade-up space-y-4">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
                            BOOK YOUR STRATEGY CALL
                        </h2>
                        <div className="h-2 w-24 bg-primary mx-auto rounded-full" />
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
                            Select a time that works best for you to discuss your business growth.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-12 items-start">
                        <div className="lg:col-span-3 bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl">
                             <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                <CalendarIcon className="w-7 h-7 text-primary" />
                                1. Select a Date
                            </h3>
                            <div className="flex justify-center">
                                <div className="transform md:scale-110 origin-center">
                                    <CalendarComponent
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        className="w-full"
                                        disabled={(date) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            return date < today || date.getDay() === 0;
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl h-full sticky top-24">
                                <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                                    <Clock className="w-7 h-7 text-primary" />
                                    2. Pick a Time
                                </h3>

                                <div className="space-y-6">
                                    {date ? (
                                        <>
                                            <div className="bg-muted/50 p-4 rounded-2xl border border-border mb-6">
                                                <p className="text-lg font-black text-center">{format(date, "EEEE, MMM do")}</p>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                                {isLoadingSlots ? (
                                                    <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-2xl bg-muted/20">
                                                        <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-primary" />
                                                        <p className="font-bold">Syncing availability...</p>
                                                    </div>
                                                ) : (
                                                    timeSlots.map((time) => {
                                                        const normalizeTime = (t: string) => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '');
                                                        const isTaken = bookedSlots.some(s => normalizeTime(s) === normalizeTime(time));

                                                        return (
                                                            <Button
                                                                key={time}
                                                                variant={selectedTime === time ? "default" : "outline"}
                                                                className={cn(
                                                                    "h-14 font-black text-lg rounded-xl transition-all relative border-2",
                                                                    selectedTime === time && "ring-4 ring-primary/20 scale-[1.02] shadow-lg",
                                                                    isTaken && "opacity-40 line-through grayscale cursor-not-allowed bg-muted"
                                                                )}
                                                                disabled={isTaken}
                                                                onClick={() => setSelectedTime(time)}
                                                            >
                                                                {time}
                                                                {isTaken && <span className="absolute right-4 text-[10px] font-black uppercase text-red-500">Booked</span>}
                                                            </Button>
                                                        );
                                                    })
                                                )}
                                            </div>

                                            <Button
                                                className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/30 mt-8 transform active:scale-95 transition-all"
                                                disabled={!selectedTime}
                                                onClick={handleBookingClick}
                                            >
                                                Proceed to Details
                                                <ArrowRight className="w-6 h-6 ml-3" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="h-64 flex flex-col items-center justify-center text-muted-foreground text-center p-8 border-4 border-dotted border-border rounded-[2rem] bg-muted/20">
                                            <CalendarIcon className="w-14 h-14 mb-4 opacity-20 animate-pulse" />
                                            <p className="font-black text-lg">Select a date to see times</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
