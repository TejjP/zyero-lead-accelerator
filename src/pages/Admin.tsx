import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Loader2,
    Trash2,
    RefreshCw,
    AlertCircle,
    Calendar as CalendarIcon,
    Clock,
    Edit2,
    Lock,
    Unlock,
    User,
    Mail,
    Phone
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Booking {
    id?: number;
    date: string;
    time: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    details: string;
    status: string;
}

const timeSlots = [
    "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM",
];

export default function Admin() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isActionInProgress, setIsActionInProgress] = useState<string | null>(null);
    const { toast } = useToast();

    // Reschedule Dialog State
    const [rescheduleData, setRescheduleData] = useState<Booking | null>(null);
    const [newDate, setNewDate] = useState<Date | undefined>(new Date());
    const [newTime, setNewTime] = useState<string | null>(null);

    // Availability Management State
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [busySlots, setBusySlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // SECURITY: Matches the token in the Google Apps Script
    const ADMIN_TOKEN = "zyero_admin_2025_safe";
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getAll&token=${ADMIN_TOKEN}`);
            const data = await response.json();
            if (data.bookings) {
                setBookings(data.bookings);
            }
        } catch (error) {
            toast({ title: "Fetch Failed", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBusySlots = async (dateStr: string) => {
        setIsLoadingSlots(true);
        try {
            const response = await fetch(`${GOOGLE_SCRIPT_URL}?date=${dateStr}&_=${Date.now()}`);
            const data = await response.json();
            setBusySlots(data.bookedTimes || []);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setIsLoadingSlots(false);
        }
    };

    useEffect(() => {
        if (selectedDate && isAuthenticated) {
            fetchBusySlots(format(selectedDate, "yyyy-MM-dd"));
        }
    }, [selectedDate, isAuthenticated]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === "admin123") {
            setIsAuthenticated(true);
            fetchBookings();
        } else {
            toast({ title: "Access Denied", variant: "destructive" });
        }
    };

    const performAction = async (action: string, payload: any) => {
        const actionId = `${action}-${payload.date}-${payload.time}`;
        setIsActionInProgress(actionId);
        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify({ ...payload, action, token: ADMIN_TOKEN }),
            });
            const result = await response.json();
            if (result.status === "success") {
                const detailStr = result.details
                    ? ` (Sheet: ${result.details.sheet_records}, Calendar: ${result.details.calendar_events})`
                    : "";
                toast({
                    title: "Success",
                    description: (result.message || "Action completed") + detailStr
                });
                // Add a small delay for GAS to process the spreadsheet update
                setTimeout(() => {
                    fetchBookings();
                    if (selectedDate) fetchBusySlots(format(selectedDate, "yyyy-MM-dd"));
                }, 2000);
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsActionInProgress(null);
        }
    };

    const handleCancel = (booking: Booking) => {
        if (confirm(`Cancel booking for ${booking.name}?`)) {
            performAction("cancel", {
                date: booking.date,
                time: booking.time,
                name: booking.name,
                email: booking.email
            });
        }
    };

    const normalizeTime = (t: string) => t.trim().toLowerCase().replace(/^0/, '').replace(/\s+/g, '');

    const handleBlockToggle = (time: string, isAlreadyBusy: boolean) => {
        const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
        // If it's busy, we try to "unblock" (which is the same as cancel logic in GAS)
        if (isAlreadyBusy) {
            performAction("unblock", { date: dateStr, time });
        } else {
            performAction("block", { date: dateStr, time });
        }
    };

    const submitReschedule = () => {
        if (!rescheduleData || !newDate || !newTime) return;
        performAction("reschedule", {
            oldDate: rescheduleData.date,
            oldTime: rescheduleData.time,
            newDate: format(newDate, "yyyy-MM-dd"),
            newTime: newTime,
            name: rescheduleData.name,
            email: rescheduleData.email
        });
        setRescheduleData(null);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="w-full max-w-md p-8 bg-white rounded-3xl border shadow-2xl space-y-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                        <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black">Admin Access</h1>
                        <p className="text-muted-foreground">Manage your real estate lead bookings.</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="password"
                            placeholder="Password"
                            className="h-12 rounded-xl"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button type="submit" className="w-full h-12 font-bold rounded-xl shadow-lg shadow-primary/20">
                            Unlock Dashboard
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-8 md:px-16 lg:px-24 pt-32 pb-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight">Booking Dashboard</h1>
                        <p className="text-muted-foreground">Control appointments and availability.</p>
                    </div>
                    <Button onClick={fetchBookings} variant="outline" className="h-12 rounded-xl" disabled={isLoading}>
                        <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
                        Refresh
                    </Button>
                </div>

                <Tabs defaultValue="bookings" className="space-y-6">
                    <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 w-full md:w-auto grid grid-cols-2">
                        <TabsTrigger value="bookings" className="rounded-xl h-12 font-bold">
                            <User className="w-4 h-4 mr-2" />
                            Bookings
                        </TabsTrigger>
                        <TabsTrigger value="availability" className="rounded-xl h-12 font-bold">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            Availability
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="bookings" className="space-y-4">
                        <div className="bg-card rounded-3xl border shadow-xl overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow>
                                        <TableHead className="py-5 font-bold">Client</TableHead>
                                        <TableHead className="font-bold">Date & Time</TableHead>
                                        <TableHead className="font-bold">Contact</TableHead>
                                        <TableHead className="font-bold">Company</TableHead>
                                        <TableHead className="text-right font-bold pr-8">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.length === 0 && !isLoading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-20 text-muted-foreground">
                                                No bookings found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        bookings.map((booking, idx) => (
                                            <TableRow key={idx} className="hover:bg-muted/10 border-border group">
                                                <TableCell className="py-4 font-bold text-lg">
                                                    {booking.status === "BLOCKED" ? (
                                                        <span className="flex items-center text-orange-500 gap-2">
                                                            <Lock className="w-4 h-4" />
                                                            Blocked Slot
                                                        </span>
                                                    ) : booking.name}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{booking.date}</span>
                                                        <span className="text-primary text-sm font-bold">{booking.time}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {booking.status !== "BLOCKED" && (
                                                        <div className="space-y-1 text-sm">
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Mail className="w-3 h-3" /> {booking.email}
                                                            </div>
                                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                                <Phone className="w-3 h-3" /> {booking.phone}
                                                            </div>
                                                        </div>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {booking.company || "-"}
                                                </TableCell>
                                                <TableCell className="text-right pr-6">
                                                    <div className="flex justify-end gap-2">
                                                        {booking.status !== "BLOCKED" && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg h-9"
                                                                onClick={() => {
                                                                    setRescheduleData(booking);
                                                                    setNewDate(new Date(booking.date));
                                                                    setNewTime(booking.time);
                                                                }}
                                                            >
                                                                <Edit2 className="w-4 h-4 mr-2" /> Reschedule
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            className="rounded-lg h-9"
                                                            onClick={() => handleCancel(booking)}
                                                            disabled={isActionInProgress === `cancel-${booking.date}-${booking.time}`}
                                                        >
                                                            {isActionInProgress === `cancel-${booking.date}-${booking.time}` ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                                    {booking.status === "BLOCKED" ? "Remove Block" : "Cancel"}
                                                                </>
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </TabsContent>

                    <TabsContent value="availability" className="space-y-6">
                        <div className="grid lg:grid-cols-2 gap-8 items-start">
                            <div className="bg-card rounded-3xl border shadow-xl p-8">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                                    <CalendarIcon className="w-5 h-5" />
                                    1. Choose Date
                                </h3>
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-2xl border border-border/50 mx-auto"
                                />
                            </div>

                            <div className="bg-card rounded-3xl border shadow-xl p-8 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-primary" />
                                        2. Toggle Access
                                    </h3>
                                    {selectedDate && (
                                        <span className="text-sm font-bold bg-muted px-4 py-1.5 rounded-full">
                                            {format(selectedDate, "MMMM do")}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {isLoadingSlots ? (
                                        <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                                            Syncing with Google Calendar...
                                        </div>
                                    ) : (
                                        timeSlots.map((time) => {
                                            const isBusy = busySlots.some(s => normalizeTime(s) === normalizeTime(time));
                                            const actionId = `${isBusy ? 'unblock' : 'block'}-${selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}-${time}`;
                                            const activeAction = isActionInProgress === actionId;

                                            return (
                                                <div key={time} className={cn(
                                                    "flex items-center justify-between p-5 rounded-2xl border transition-all",
                                                    isBusy ? "bg-orange-50 border-orange-200" : "bg-muted/10 border-border/50"
                                                )}>
                                                    <div className="flex items-center gap-4">
                                                        <div className={cn(
                                                            "w-12 h-12 rounded-2xl flex items-center justify-center",
                                                            isBusy ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground"
                                                        )}>
                                                            <Clock className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-lg">{time}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {isBusy ? "Hidden from site" : "Publicly available"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant={isBusy ? "outline" : "default"}
                                                        className="rounded-xl h-11 px-6 font-bold"
                                                        onClick={() => handleBlockToggle(time, isBusy)}
                                                        disabled={activeAction}
                                                    >
                                                        {activeAction ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : isBusy ? (
                                                            <><Unlock className="w-4 h-4 mr-2" /> Allow Slot</>
                                                        ) : (
                                                            <><Lock className="w-4 h-4 mr-2" /> Block Slot</>
                                                        )}
                                                    </Button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="mt-12 p-8 bg-primary/5 rounded-3xl border border-primary/10 flex items-start gap-5">
                    <AlertCircle className="w-8 h-8 text-primary shrink-0" />
                    <div className="space-y-2">
                        <h4 className="font-bold text-xl">Two-Way Sync Active</h4>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Any event you add directly to your <strong className="text-foreground">Google Calendar</strong> will automatically block that time on your website.
                            Manual blocks added here will also be sent to your Sheet to prevent double bookings.
                        </p>
                    </div>
                </div>
            </div>

            {/* Reschedule Dialog */}
            <Dialog open={!!rescheduleData} onOpenChange={(open) => !open && setRescheduleData(null)}>
                <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                    <div className="h-2 bg-primary w-full" />
                    <div className="p-8">
                        <DialogHeader className="mb-8">
                            <DialogTitle className="text-2xl font-black">Move Appointment</DialogTitle>
                            <DialogDescription className="text-lg">
                                Rescheduling for <strong>{rescheduleData?.name}</strong>.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8">
                            <div className="bg-muted/30 p-4 rounded-3xl border border-border/50">
                                <Calendar
                                    mode="single"
                                    selected={newDate}
                                    onSelect={setNewDate}
                                    className="mx-auto"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Select New Time</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    {timeSlots.map((time) => (
                                        <Button
                                            key={time}
                                            variant={newTime === time ? "default" : "outline"}
                                            className="rounded-xl h-12 font-bold text-base"
                                            onClick={() => setNewTime(time)}
                                        >
                                            {time}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="mt-10 flex gap-4">
                            <Button variant="ghost" onClick={() => setRescheduleData(null)} className="rounded-xl flex-1 h-14 text-lg">
                                Cancel
                            </Button>
                            <Button onClick={submitReschedule} className="rounded-xl flex-[2] h-14 font-black text-lg shadow-xl shadow-primary/20">
                                Confirm Change
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
