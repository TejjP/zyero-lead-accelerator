import { Layout } from "@/components/layout/Layout";

export default function TermsOfService() {
    const lastUpdated = "February 17, 2026";

    return (
        <Layout>
            <section className="pt-32 pb-24 min-h-screen">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">Terms of Service</h1>
                        <p className="text-foreground/60 mb-12">Last Updated: {lastUpdated}</p>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        By accessing or using the services provided by Zyero Lead ("we," "us," or "our"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. Description of Service</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        Zyero Lead provides real estate lead acquisition and marketing services. Our services include but are not limited to buyer lead generation, lead verification, and CRM integration consulting.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. Use of Services</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that all persons who access our services through your internet connection are aware of these Terms and comply with them.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        The content, features, and functionality of our services, including but not limited to text, graphics, logos, and software, are owned by Zyero Lead and are protected by international copyright, trademark, and other intellectual property laws.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        In no event shall Zyero Lead, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Governing Law</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">7. Changes to Terms</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        If you have any questions about these Terms, please contact us:
                                    </p>
                                    <p>
                                        Email: <a href="mailto:zyerolead@gmail.com" className="text-primary hover:underline">zyerolead@gmail.com</a><br />
                                        Phone: +91 9428623376
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
