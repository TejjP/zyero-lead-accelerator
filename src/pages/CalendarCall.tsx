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
import { Clock, ArrowRight, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
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

    const sessionBookedSlots = useRef<Record<string, string[]>>({});

    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

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
        <Layout>
            <section className="py-20 px-4 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12 animate-fade-up">
                        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                            BOOK YOUR STRATEGY CALL
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Select a time that works best for you to discuss your business growth.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3 bg-card rounded-3xl p-6 border border-border shadow-xl">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="w-full"
                                disabled={(date) => date < new Date() || date.getDay() === 0}
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-card rounded-3xl p-6 border border-border shadow-xl h-full sticky top-24">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Available Times
                                </h3>

                                <div className="space-y-3">
                                    {date ? (
                                        <>
                                            <div className="grid grid-cols-1 gap-2 mb-6">
                                                {isLoadingSlots ? (
                                                    <div className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">
                                                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                                                        <p className="text-sm">Syncing availability...</p>
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
                                                                    "h-12 font-bold transition-all relative",
                                                                    isTaken && "opacity-50 line-through grayscale cursor-not-allowed"
                                                                )}
                                                                disabled={isTaken}
                                                                onClick={() => setSelectedTime(time)}
                                                            >
                                                                {time}
                                                                {isTaken && <span className="absolute right-3 text-[10px] opacity-70">Booked</span>}
                                                            </Button>
                                                        );
                                                    })
                                                )}
                                            </div>

                                            <Button
                                                className="w-full h-14 text-lg font-bold"
                                                disabled={!selectedTime}
                                                onClick={handleBookingClick}
                                            >
                                                Book Call
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-muted-foreground text-sm p-4 border border-dashed rounded-lg">
                                            Select a date to see times
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog open={isDialogOpen} onOpenChange={(open) => setIsDialogOpen(open)}>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh] flex flex-col p-0 overflow-hidden">
                    <div className="h-2 bg-primary shrink-0" />
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">!</div>
                            <p className="text-sm font-medium text-red-800 leading-tight">
                                This call is for serious professionals looking to build a predictable listing system.
                            </p>
                        </div>
                        <DialogHeader>
                            <DialogTitle>Your Details</DialogTitle>
                            <DialogDescription>
                                {step === 1 ? (
                                    <>
                                        Booking for {date && format(date, "MMMM do")} @ {selectedTime}
                                    </>
                                ) : (
                                    "Tell us a bit more about your business."
                                )}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                            {step === 1 ? (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name *</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        onClick={handleNextStep}
                                    >
                                        Continue <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-2">
                                        <Label htmlFor="dealsClosed">How many deals have you closed this year? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, dealsClosed: value }))}
                                            value={formData.dealsClosed}
                                        >
                                            <SelectTrigger>
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
                                        <Label htmlFor="clientSourcing">How are you finding clients now? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, clientSourcing: value }))}
                                            value={formData.clientSourcing}
                                        >
                                            <SelectTrigger>
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
                                        <Label htmlFor="targetMarket">Which city or market do you primarily operate in? *</Label>
                                        <Input
                                            id="targetMarket"
                                            name="targetMarket"
                                            required
                                            value={formData.targetMarket}
                                            onChange={(e) => setFormData(prev => ({ ...prev, targetMarket: e.target.value }))}
                                            placeholder="e.g. Mumbai"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="role">What's your role? *</Label>
                                        <Select
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                                            value={formData.role}
                                        >
                                            <SelectTrigger>
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
                                            className="w-full"
                                            disabled={isSubmitting}
                                            onClick={() => setStep(1)}
                                        >
                                            <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Confirming...
                                                </>
                                            ) : (
                                                "Confirm Booking"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
