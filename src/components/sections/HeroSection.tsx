import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroBg from "@/assets/hero-bg.png";

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);

  const [todaysCount, setTodaysCount] = useState(47);
  const [displayedLeads, setDisplayedLeads] = useState([
    { name: "Rahul Sharma", budget: "₹85L - ₹1.2Cr", type: "3BHK", city: "Mumbai" },
    { name: "Priya Patel", budget: "₹45L - ₹60L", type: "2BHK", city: "Pune" },
    { name: "Amit Verma", budget: "₹1.5Cr - ₹2Cr", type: "Villa", city: "Bangalore" },
  ]);

  // Pool of dummy leads
  const allLeads = [
    { name: "Rahul Sharma", budget: "₹85L - ₹1.2Cr", type: "3BHK", city: "Mumbai" },
    { name: "Priya Patel", budget: "₹45L - ₹60L", type: "2BHK", city: "Pune" },
    { name: "Amit Verma", budget: "₹1.5Cr - ₹2Cr", type: "Villa", city: "Bangalore" },
    { name: "Sneha Gupta", budget: "₹65L - ₹80L", type: "2.5BHK", city: "Hyderabad" },
    { name: "Vikram Singh", budget: "₹2.5Cr+", type: "Penthouse", city: "Delhi" },
    { name: "Anjali Mehta", budget: "₹55L - ₹70L", type: "2BHK", city: "Ahmedabad" },
    { name: "Rohan Das", budget: "₹90L - ₹1.1Cr", type: "3BHK", city: "Kolkata" },
    { name: "Kavita Reddy", budget: "₹1.2Cr - ₹1.5Cr", type: "Villa", city: "Hyderabad" },
    { name: "Arjun Nair", budget: "₹75L - ₹95L", type: "3BHK", city: "Chennai" },
    { name: "Neha Kapoor", budget: "₹1.8Cr+", type: "4BHK", city: "Mumbai" },
    { name: "Suresh Kumar", budget: "₹40L - ₹55L", type: "2BHK", city: "Pune" },
    { name: "Divya Malhotra", budget: "₹3Cr+", type: "Farmhouse", city: "Delhi NCR" },
    { name: "Rajesh Iyer", budget: "₹60L - ₹75L", type: "2BHK", city: "Bangalore" },
    { name: "Meera Joshi", budget: "₹1.1Cr - ₹1.4Cr", type: "3BHK", city: "Pune" },
    { name: "Vivek Choudhary", budget: "₹80L - ₹1Cr", type: "3BHK", city: "Jaipur" },
    { name: "Zoya Khan", budget: "₹50L - ₹65L", type: "2BHK", city: "Lucknow" },
    { name: "Aditya Roy", budget: "₹1.5Cr - ₹1.8Cr", type: "Villa", city: "Chandigarh" },
    { name: "Tanvi Shah", budget: "₹70L - ₹90L", type: "3BHK", city: "Surat" },
    { name: "Varun Malhotra", budget: "₹2.2Cr+", type: "4BHK", city: "Gurgaon" },
    { name: "Ishita Dutta", budget: "₹95L - ₹1.2Cr", type: "3BHK", city: "Noida" }
  ];

  useEffect(() => {
    // 1. Set daily stats based on date seed
    const today = new Date();
    const dateString = today.toDateString();
    const seed = dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Generate number between 42 and 68 based on seed
    const dailyCount = 42 + (seed % 27);
    setTodaysCount(dailyCount);

    // 2. Setup rotation for recent leads (changes every 5 min)
    // We'll use the current timestamp to determine which batch to show
    // 5 minutes = 300,000 ms

    const updateLeads = () => {
      const now = Date.now();
      const interval = 5 * 60 * 1000; // 5 minutes
      const startIdx = (Math.floor(now / interval) * 3) % allLeads.length;

      const newLeads = [];
      for (let i = 0; i < 3; i++) {
        newLeads.push(allLeads[(startIdx + i) % allLeads.length]);
      }
      setDisplayedLeads(newLeads);
    };

    updateLeads(); // Initial call
    const timer = setInterval(updateLeads, 60000); // Check every minute if it's time to update (or just rely on the math)

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = heroRef.current?.querySelectorAll(".animate-on-scroll");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
        }}
      />
      <div className="absolute inset-0 section-gradient" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />

      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-primary/20 rounded-2xl rotate-12 hidden lg:block" />
      <div className="absolute bottom-1/4 right-20 w-16 h-16 bg-primary/10 rounded-full hidden lg:block" />
      <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-primary/20 rotate-45 hidden lg:block" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div
              className="animate-on-scroll opacity-0"
              style={{ animationDelay: "0.1s" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                India's #1 Real Estate Lead Specialist
              </span>
            </div>

            <h1
              className="animate-on-scroll opacity-0 text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight"
              style={{ animationDelay: "0.2s" }}
            >
              We Acquire Verified Real Estate Buyer Leads{" "}
              <span className="text-gradient">Daily.</span>
            </h1>

            <p
              className="animate-on-scroll opacity-0 text-lg md:text-xl text-foreground/60 max-w-xl mx-auto lg:mx-0"
              style={{ animationDelay: "0.3s" }}
            >
              Zyero Lead is India's leading Real Estate Buyer Lead Acquisition
              Specialist. We deliver verified, high-intent buyer leads directly
              to your sales team.
            </p>

            <div
              className="animate-on-scroll opacity-0 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              style={{ animationDelay: "0.4s" }}
            >
              <Button asChild variant="hero" size="xl">
                <Link to="/calendar-call">
                  Book a 15-Min Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div
              className="animate-on-scroll opacity-0 grid grid-cols-3 gap-8 pt-8 border-t border-border/50"
              style={{ animationDelay: "0.5s" }}
            >
              <div>
                <p className="text-3xl font-black text-primary">50+</p>
                <p className="text-sm text-foreground/50">Clients Served</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">20K+</p>
                <p className="text-sm text-foreground/50">Leads Delivered</p>
              </div>
              <div>
                <p className="text-3xl font-black text-primary">31%</p>
                <p className="text-sm text-foreground/50">Avg Conversion</p>
              </div>
            </div>
          </div>

          {/* Dashboard Mockup */}
          <div
            className="animate-on-scroll opacity-0 relative"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="relative z-10">
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">Lead Dashboard</h3>
                  <span className="px-3 py-1 bg-green-500/10 text-green-600 text-xs font-medium rounded-full">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-foreground/50">Today's Leads</p>
                    <p className="text-2xl font-bold">{todaysCount}</p>
                    <p className="text-xs text-green-600">+12% from yesterday</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-sm text-foreground/50">Verified Rate</p>
                    <p className="text-2xl font-bold">94%</p>
                    <p className="text-xs text-green-600">Above target</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium">Recent Leads</p>
                  {displayedLeads.map((lead, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                          {lead.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{lead.name}</p>
                          <p className="text-xs text-foreground/50">{lead.type} • {lead.city}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-primary">{lead.budget}</p>
                        <p className="text-xs text-green-600">Verified</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-full h-full bg-primary/10 rounded-2xl -z-10" />
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-primary/5 rounded-2xl -z-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
