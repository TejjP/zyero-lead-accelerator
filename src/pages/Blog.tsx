import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";

const blogPosts = [
  {
    slug: "generate-real-estate-buyer-leads-2025",
    title: "How to Generate Real Estate Buyer Leads in 2025",
    excerpt:
      "The real estate lead generation landscape has evolved dramatically. Here's your complete guide to acquiring qualified buyer leads in 2025 using proven digital strategies.",
    image: "lead-gen",
    category: "Lead Generation",
    author: "Tej",
    date: "January 15, 2025",
    readTime: "8 min read",
  },
  {
    slug: "buyer-verification-matters-real-estate",
    title: "Why Buyer Verification Matters in Real Estate",
    excerpt:
      "80% of real estate leads are unqualified or fake. Learn why verification is crucial and how it can transform your sales team's productivity and ROI.",
    image: "verification",
    category: "Industry Insights",
    author: "Tej",
    date: "January 10, 2025",
    readTime: "6 min read",
  },
  {
    slug: "real-estate-ad-strategies-indian-builders",
    title: "Best Real Estate Ad Strategies for Indian Builders",
    excerpt:
      "From Facebook to Google to Instagram discover the most effective advertising strategies that top Indian builders use to generate consistent buyer leads.",
    image: "ads",
    category: "Marketing",
    author: "Priya",
    date: "January 5, 2025",
    readTime: "10 min read",
  },
  {
    slug: "crm-automation-improves-property-sales",
    title: "How CRM Automation Improves Property Sales",
    excerpt:
      "Manual lead follow-up is killing your sales. Learn how CRM automation can increase your conversion rates by up to 40% while saving your team hours every week.",
    image: "crm",
    category: "Sales",
    author: "Amit",
    date: "December 28, 2024",
    readTime: "7 min read",
  },
];

export default function Blog() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 section-gradient" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-primary text-sm font-semibold uppercase tracking-wider">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mt-4 mb-6">
              Insights &{" "}
              <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
              Expert insights on real estate lead generation, marketing
              strategies, and sales optimization.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group glass-card overflow-hidden hover-lift"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <span className="text-4xl font-black text-primary/30">
                    {post.image.toUpperCase()}
                  </span>
                </div>

                <div className="p-6">
                  {/* Category */}
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {post.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-foreground/60 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4 text-xs text-foreground/50">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-foreground/50">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              Stay Updated
            </h2>
            <p className="text-foreground/60 mb-8">
              Get the latest insights on real estate lead generation delivered
              to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="h-12 px-6 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
