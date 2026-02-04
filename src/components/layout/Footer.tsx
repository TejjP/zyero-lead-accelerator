import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, X, Instagram, Facebook } from "lucide-react";

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Case Studies", href: "/case-studies" },
  { name: "Contact", href: "/contact" },
  { name: "Book Strategy Call", href: "/calendar-call" },
];

const services = [
  "Buyer Lead Acquisition",
  "Lead Verification",
  "CRM Integration",
  "Appointment Booking",
  "Campaign Management",
];

const socialLinks = [
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: X, href: "#", label: "X" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Facebook, href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-8 md:px-16 lg:px-24 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                Zyero<span className="text-primary">Lead</span>
              </span>
            </Link>
            <p className="text-background/60 text-sm leading-relaxed">
              India's leading Real Estate Buyer Lead Acquisition Specialist.
              We help builders, developers & realtors scale with verified buyer leads.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-background/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-6">Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <span className="text-background/60 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="mailto:zyerolead@gmail.com"
                  className="text-background/60 hover:text-primary transition-colors text-sm"
                >
                  zyerolead@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <a
                  href="tel:+919428623376"
                  className="text-background/60 hover:text-primary transition-colors text-sm"
                >
                  +91 9428623376
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-background/60 text-sm">
                  Vadodara, Gujarat, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/40 text-sm">
            © {new Date().getFullYear()} Zyero Lead. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-background/40 hover:text-background/60 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-background/40 hover:text-background/60 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
