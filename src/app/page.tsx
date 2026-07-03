import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Calendar, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 flex h-16 max-w-screen-2xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Brain size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight">StudySphere</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#about" className="hover:text-foreground transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" className="text-sm">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="hidden md:flex">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-24 pb-32 lg:pt-36 lg:pb-40">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
            <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] rounded-full bg-blue-500/20 blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span>Introducing StudySphere 2.0</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Your Academic Life, <br className="hidden md:block"/> Beautifully Organized
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              The modern AI-powered workspace for students. Organize notes, generate flashcards, chat with your PDFs, and track your habits all in one intuitive platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sign-up">
                <Button size="lg" className="rounded-full px-8 h-12 text-base w-full sm:w-auto group">
                  Start studying for free
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base w-full sm:w-auto">
                  Explore features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4 max-w-screen-xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to excel</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop jumping between five different apps. StudySphere combines the best study tools into one cohesive, beautiful experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI Document Chat</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Upload your textbooks and lectures. Our AI instantly answers questions, extracts key points, and generates summaries with citations.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Flashcards</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Turn any note or PDF into intelligent flashcards in seconds. Use our spaced repetition system to memorize concepts faster.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="glass-card p-8 group hover:border-primary/50 transition-colors">
                <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                  <Calendar className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dynamic Planner</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Enter your exam dates and subjects. Our AI generates an optimized daily study schedule to ensure you&apos;re fully prepared.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-12 bg-background">
        <div className="container mx-auto px-4 max-w-screen-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain size={20} className="text-primary" />
            <span className="font-bold tracking-tight">StudySphere</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StudySphere. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Privacy</Link>
            <Link href="#" className="hover:text-foreground">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
