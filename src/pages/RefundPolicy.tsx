import { Layout } from "@/components/layout/Layout";

export default function RefundPolicy() {
    const lastUpdated = "February 17, 2026";

    return (
        <Layout>
            <section className="pt-32 pb-24 min-h-screen">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">Returns, Refunds & Cancellation Policy</h1>
                        <p className="text-foreground/60 mb-12">Last Updated: {lastUpdated}</p>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Overview</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        At Zyero Lead, we strive to provide the highest quality lead generation services. Due to the nature of digital marketing and lead acquisition services, we have established the following policy regarding returns, refunds, and cancellations.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. Cancellation Policy</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        <strong>A. Monthly Service Plans:</strong> You may cancel your monthly service plan at any time. To avoid being charged for the next billing cycle, cancellation requests must be submitted at least 7 days before your next scheduled payment.
                                    </p>
                                    <p>
                                        <strong>B. Project-Based Services:</strong> Cancellation of project-based services is subject to the work already performed. If a project is cancelled after work has commenced, you will be responsible for the cost of the work completed up to the date of cancellation.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. Refund Policy</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        <strong>A. Setup Fees:</strong> All setup fees or initial structural fees are non-refundable as they cover the labor and resources required to initialize your campaigns and systems.
                                    </p>
                                    <p>
                                        <strong>B. Leads Delivered:</strong> Once leads have been delivered to your CRM or specified platform, no refunds will be issued for those leads. We guarantee the delivery of leads as per our verification standards, but we do not guarantee conversions or sales outcomes.
                                    </p>
                                    <p>
                                        <strong>C. Ad Spend:</strong> Ad spend paid directly to platforms (e.g., Meta, Google) is non-refundable by Zyero Lead. We manage your budget, but the funds are processed by the respective platforms.
                                    </p>
                                    <p>
                                        <strong>D. Extraordinary Circumstances:</strong> If we fail to deliver the services as outlined in our agreement due to our own technical failure or negligence, a pro-rata refund for the affected period may be considered at our sole discretion.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Lead Replacement</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        While we do not offer monetary refunds for leads, we may offer lead replacement if a delivered lead is found to be non-functional (e.g., invalid phone number or email) within 48 hours of delivery. This is subject to our internal verification and audit.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Contact Us</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        If you have any questions or wish to request a cancellation or refund, please contact our billing department:
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
