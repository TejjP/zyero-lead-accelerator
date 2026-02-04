import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How are leads verified?",
    answer:
      "Every lead goes through our dual verification process. First, our AI system validates phone numbers, email addresses, and checks for duplicate entries. Then, our human verification team makes a discovery call to confirm buying intent, budget range, and property preferences. Only leads that pass both stages are delivered to you.",
  },
  {
    question: "What makes Zyero Lead different from other lead gen agencies?",
    answer:
      "Unlike traditional agencies that focus on volume, we prioritize quality. Our verification rate is 94%+, meaning you only pay for leads that are genuine buyers. We also offer appointment booking services, CRM integration, and a dedicated account manager on Growth and Enterprise plans.",
  },
  {
    question: "What locations do you target?",
    answer:
      "We currently operate in all major Indian cities including Mumbai, Pune, Bangalore, Hyderabad, Chennai, Delhi NCR, Kolkata, and Ahmedabad. For Enterprise clients, we can expand to Tier 2 and Tier 3 cities as well.",
  },
  {
    question: "How fast do we start receiving leads?",
    answer:
      "Once your campaign is set up (typically 2-3 business days), you can expect to receive your first leads within 24-48 hours. Lead flow stabilizes within the first week as our targeting algorithms optimize for your specific property type.",
  },
  {
    question: "What information do you capture for each lead?",
    answer:
      "Each verified lead includes: Full name, verified phone number, email address, preferred property type (1BHK/2BHK/3BHK/Villa/Plot), budget range, preferred location, timeline to purchase, and any specific requirements mentioned during verification.",
  },
  {
    question: "Do you integrate with our existing CRM?",
    answer:
      "Yes! We integrate with all major CRMs including Salesforce, HubSpot, Zoho CRM, and custom solutions. Leads are automatically pushed to your CRM in real-time, with all verification details included. API access is available for Enterprise clients.",
  },
  {
    question: "What is your refund policy for unqualified leads?",
    answer:
      "We stand behind our verification process. If a lead turns out to be fake, unreachable after 3 attempts, or clearly uninterested, we replace it at no extra cost. Simply notify our team, and we will review and credit your account.",
  },
  {
    question: "Can I pause or cancel my subscription?",
    answer:
      "Yes, you can pause your subscription at any time for up to 30 days. Cancellations require 7 days notice before your next billing cycle. There are no long-term contracts we earn your business every month.",
  },
];

export function FAQSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-8 md:px-16 lg:px-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mt-4 mb-6">
            Frequently Asked{" "}
            <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-lg text-foreground/60">
            Everything you need to know about working with Zyero Lead.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-foreground/70 pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
