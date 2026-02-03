import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsApp = () => {
    const { name, email, phone, company, city, message } = formData;
    if (!name || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least your Name and Message to send via WhatsApp.",
        variant: "destructive"
      });
      return;
    }

    const text = `*New Contact Request*\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Company:* ${company}\n*City:* ${city}\n*Message:* ${message}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/919428623376?text=${encodedText}`, '_blank');
  };

  // reusing the same script as BookCall for unified data entry
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfoanV0ZAhs8esVGtci22cMRlCuY2DvYiVrPg7DbV14lnyhXs8pIed3DYEkCY_U15hNw/exec";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        // Map fields to match what the script likely expects or can handle
        description: `Message: ${formData.message} | City: ${formData.city}`,
        date: new Date().toISOString().split('T')[0], // Current date
        time: "Contact Request", // Tag it as a contact request
        created_at: new Date().toISOString()
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });

      // With no-cors, we can't check response.ok, so we assume success if it didn't throw
      toast({
        title: "Message sent!",
        description: "We've received your message and will get back to you shortly.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        message: ""
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us via WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Let's Start a{" "}
              <span className="text-gradient">Conversation</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Have questions? Need a custom strategy? We're here to
              help you scale your real estate business.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
                <p className="text-foreground/60">
                  Whether you're ready to start or just have questions, our team
                  is here to help.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email Us</h3>
                    <a
                      href="mailto:zyerolead@gmail.com"
                      className="text-foreground/60 hover:text-primary transition-colors"
                    >
                      zyerolead@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Call Us</h3>
                    <a
                      href="tel:+919428623376"
                      className="text-foreground/60 hover:text-primary transition-colors"
                    >
                      +91 9428623376
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Visit Us</h3>
                    <p className="text-foreground/60">
                      Vadodara, Gujarat, India
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Link */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-green-600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Chat on WhatsApp</h3>
                    <p className="text-sm text-foreground/60">
                      Get quick responses on WhatsApp
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a
                      href="https://wa.me/919428623376"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Chat Now
                    </a>
                  </Button>
                </div>
              </div>

              {/* Office Hours */}
              <div className="p-6 bg-muted/50 rounded-2xl">
                <h3 className="font-semibold mb-3">Office Hours</h3>
                <div className="space-y-2 text-sm text-foreground/60">
                  <p>Monday - Friday: 9:00 AM - 7:00 PM IST</p>
                  <p>Saturday: 10:00 AM - 4:00 PM IST</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="xyz@gmail.com"
                      required
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phone *
                    </label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 12345 67890"
                      required
                      className="h-12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company Name
                    </label>
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company"
                      className="h-12"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    City
                  </label>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Your city"
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    required
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>

                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">Or</span>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full border-green-500/50 hover:bg-green-500/10 hover:text-green-600 text-green-600"
                    onClick={handleWhatsApp}
                  >
                    Send via WhatsApp
                    <MessageCircle className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

