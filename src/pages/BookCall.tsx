import { useState, useEffect } from "react";
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
import { CheckCircle, Clock, Users, Shield, ArrowRight, Loader2, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
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

const benefits = [
  "Discuss your specific lead acquisition challenges",
  "Get a custom strategy tailored to your projects",
  "See real examples from similar clients",
  "No commitment required just actionable insights",
];

const trustBadges = [
  { icon: Users, label: "50+ Clients Served" },
  { icon: Shield, label: "94% Verification Rate" },
  { icon: Clock, label: "48hr Lead Delivery" },
];

export default function BookCall() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    clientType: "",
    marketingStatus: "",
    budget: "",
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

  // Google Apps Script URL for booking
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxP7yQPYNxUxu_w2sFXl3JaD1zTpOkOHuhpAUiC8YbrSjVLsrg744y_7ePHELkOzZNzw/exec";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Format the data for the backend
      // Pack extra details into company field (or description) to ensure it appears on calendar
      const fullDetails = `Role: ${formData.clientType} | Ads: ${formData.marketingStatus} | Budget: ${formData.budget}`;
      const enhancedCompany = formData.company ? `${formData.company} | ${fullDetails}` : fullDetails;

      const payload = {
        ...formData,
        company: enhancedCompany,
        description: fullDetails,
        date: date ? format(date, "yyyy-MM-dd") : "",
        time: selectedTime,
        created_at: new Date().toISOString()
      };

      // 2. Send to Google Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // 3. Handle Success
      setIsSubmitting(false);
      setIsSuccess(true);

      toast({
        title: "Booking Confirmed!",
        description: "We have added it to our calendar. See you then!",
      });

    } catch (error) {
      console.error("Booking caught error:", error);
      setIsSubmitting(false);
      toast({
        title: "Submission Error",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    }
  };

  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);


  useEffect(() => {
    if (date) {
      const fetchAvailability = async () => {
        setIsLoadingSlots(true);
        const dateStr = format(date, "yyyy-MM-dd");
        try {
          const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}`);
          const data = await response.json();
          if (data.bookedTimes) setBookedSlots(data.bookedTimes);
        } catch (error) {
          console.error("Fetch availability error:", error);
        } finally {
          setIsLoadingSlots(false);
        }
      };
      fetchAvailability();
    }
  }, [date]);

  const handleClose = () => {
    setIsDialogOpen(false);
    setIsSuccess(false);
    setStep(1);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      clientType: "",
      marketingStatus: "",
      budget: ""
    });
    setSelectedTime(null);
  }

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-8 md:px-16 lg:px-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Strategy Call
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Book Your{" "}
              <span className="text-gradient">15-Minute Call</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Get a personalized strategy session with our team. No pitch, no
              pressure just actionable insights for your business.
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="grid lg:grid-cols-3 gap-12 max-w-7xl mx-auto items-start">
            {/* Left - Benefits */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black mb-6">
                What You'll Get
              </h2>
              <ul className="space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-4 p-4 bg-card rounded-2xl border border-border/50">
                    <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                    <span className="text-foreground font-semibold">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Middle - Proof */}
            <div className="space-y-8">
               <h2 className="text-3xl font-black mb-6">Verified Results</h2>
               <div className="glass-card p-8 rounded-[2.5rem]">
                <p className="text-foreground/70 italic text-lg mb-6">
                  "The strategy call alone was worth it. Tej gave us insights
                  that immediately improved our campaigns — even before we
                  signed up."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-black text-xl">
                    R
                  </div>
                  <div>
                    <p className="font-bold">Rahul M.</p>
                    <p className="text-sm text-foreground/50">
                      Director, Property Group
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Trust */}
            <div className="space-y-8">
               <h2 className="text-3xl font-black mb-6">Proven Track Record</h2>
               <div className="grid grid-cols-1 gap-4">
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-4 p-5 bg-card rounded-2xl border border-border/50"
                  >
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                        <badge.icon className="w-6 h-6" />
                    </div>
                    <p className="font-black text-foreground/80">
                      {badge.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-32 px-4 bg-muted/10 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
                BOOK YOUR STRATEGY CALL
            </h2>
            <div className="h-2 w-24 bg-primary mx-auto rounded-full" />
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
                Choose a time that works best for our personalized session.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 items-start">
            {/* Step 1: Date */}
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
                            className="bg-transparent"
                            disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return date < today || date.getDay() === 0;
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Step 2: Time */}
            <div className="lg:col-span-2">
                <div className="bg-card rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl h-full sticky top-24">
                    <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                        <Clock className="w-7 h-7 text-primary" />
                        2. Pick a Time
                    </h3>

                    {date ? (
                      <div className="space-y-8">
                        <div className="bg-muted/50 p-4 rounded-2xl border border-border mb-6">
                            <p className="text-lg font-black text-center">{format(date, "EEEE, MMM do")}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                          {isLoadingSlots ? (
                            <div className="text-center py-16 text-muted-foreground">
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
                                  disabled={isTaken}
                                  className={cn(
                                    "h-14 font-black text-lg rounded-xl transition-all relative border-2",
                                    selectedTime === time && "ring-4 ring-primary/20 scale-[1.02] shadow-lg",
                                    isTaken && "opacity-40 line-through grayscale cursor-not-allowed bg-muted"
                                  )}
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
                          Proceed to Book
                          <ArrowRight className="w-6 h-6 ml-3" />
                        </Button>

                        <div className="pt-8 border-t border-border mt-8 space-y-4">
                            <p className="text-center text-sm font-bold text-muted-foreground/60">
                                Prefer to book manually?
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                                    <a href="tel:+919428623376" className="flex items-center justify-center">
                                        Call Directly
                                    </a>
                                </Button>
                                <Button asChild variant="outline" className="flex-1 h-12 rounded-xl font-bold">
                                    <a href="https://wa.me/919428623376" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                                        WhatsApp Us
                                    </a>
                                </Button>
                            </div>
                        </div>
                      </div>
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
      </section>

      {/* Booking Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !isSuccess && setIsDialogOpen(open)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isSuccess ? "Booking Confirmed!" : "Finalize Your Booking"}
            </DialogTitle>
            <DialogDescription>
              {isSuccess
                ? "You're all set. We have sent a calendar invitation to your email address."
                : (
                  <>
                    {step === 1 ? (
                      <>
                        Please provide your details so we can confirm your slot for{" "}
                        {date && selectedTime && (
                          <span className="font-semibold text-primary">
                            {format(date, "MMM do")} at {selectedTime}
                          </span>
                        )}
                      </>
                    ) : (
                      "Just a few more details to help us prepare for our call."
                    )}
                  </>
                )
              }
            </DialogDescription>
          </DialogHeader>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {step === 1 && (
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
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      required
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Real Estate Corp"
                    />
                  </div>
                  <Button
                    type="button"
                    className="w-full"
                    onClick={handleNextStep}
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-2">
                    <Label>You are a</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, clientType: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Builder / Developer">
                          Builder / Developer
                        </SelectItem>
                        <SelectItem value="Real Estate Agent / Channel Partner">
                          Real Estate Agent / Channel Partner
                        </SelectItem>
                        <SelectItem value="Property Sales Team">
                          Property Sales Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Are you currently running ads or marketing?</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, marketingStatus: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Planning to start">
                          Planning to start
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>What is your budget?</Label>
                    <Select
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, budget: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="< 50k">&lt; 50k</SelectItem>
                        <SelectItem value="50k - 1L">50k - 1L</SelectItem>
                        <SelectItem value="1L - 5L">1L - 5L</SelectItem>
                        <SelectItem value="> 5L">5L &gt;</SelectItem>
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
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <p className="text-foreground/70">
                A confirmation email has been sent to <strong>{formData.email}</strong>.
              </p>
              <Button onClick={handleClose} className="w-full mt-2">
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Mini */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">
              Common Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is this call really free?",
                  a: "Yes, 100% free with no strings attached. We believe in demonstrating value upfront.",
                },
                {
                  q: "Will I be pressured to sign up?",
                  a: "Absolutely not. This call is about understanding your challenges and providing value. If we're a fit, great. If not, you'll still walk away with actionable insights.",
                },
                {
                  q: "Who will I be speaking with?",
                  a: "You'll speak directly with our founder Tej or a senior strategist who can provide real, personalized advice.",
                },
              ].map((item) => (
                <div key={item.q} className="glass-card p-6">
                  <h3 className="font-semibold mb-2">{item.q}</h3>
                  <p className="text-sm text-foreground/60">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
