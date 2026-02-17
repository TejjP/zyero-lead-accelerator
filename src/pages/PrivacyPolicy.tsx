import { Layout } from "@/components/layout/Layout";

export default function PrivacyPolicy() {
    const lastUpdated = "February 17, 2026";

    return (
        <Layout>
            <section className="pt-32 pb-24 min-h-screen">
                <div className="container mx-auto px-8 md:px-16 lg:px-24">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-black mb-8">Privacy Policy</h1>
                        <p className="text-foreground/60 mb-12">Last Updated: {lastUpdated}</p>

                        <div className="space-y-12">
                            <section>
                                <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        Welcome to Zyero Lead. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
                                    </p>
                                    <p>
                                        Zyero Lead provides lead generation services for the real estate industry. In the course of providing these services, we collect and process personal data.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">2. The Data We Collect</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li><strong>Identity Data:</strong> includes first name, last name, or similar identifier.</li>
                                        <li><strong>Contact Data:</strong> includes email address and telephone numbers.</li>
                                        <li><strong>Technical Data:</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
                                        <li><strong>Usage Data:</strong> includes information about how you use our website, products and services.</li>
                                        <li><strong>Marketing and Communications Data:</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">3. How We Use Your Data</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>To provide and manage our services to you.</li>
                                        <li>To personalize and tailor your experience on our website.</li>
                                        <li>To communicate with you, including responding to your enquiries.</li>
                                        <li>To supply you with information by email or telephone that you have opted-in to.</li>
                                        <li>To analyze your use of our website to enable us to continually improve our website and your user experience.</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">5. Your Legal Rights</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, and the right to withdraw consent.
                                    </p>
                                    <p>
                                        If you wish to exercise any of these rights, please contact us at <a href="mailto:zyerolead@gmail.com" className="text-primary hover:underline">zyerolead@gmail.com</a>.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
                                <div className="text-foreground/70 leading-relaxed space-y-4">
                                    <p>
                                        If you have any questions about this privacy policy or our privacy practices, please contact us:
                                    </p>
                                    <p>
                                        Email: <a href="mailto:zyerolead@gmail.com" className="text-primary hover:underline">zyerolead@gmail.com</a><br />
                                        Phone: +91 9428623376<br />
                                        Address: Vadodara, Gujarat, India
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
