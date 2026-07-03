import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp
      fallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "glass-card bg-background/60 backdrop-blur-xl border-border/50 shadow-xl",
          headerTitle: "text-2xl font-bold text-foreground",
          headerSubtitle: "text-muted-foreground",
          socialButtonsBlockButton: "border-border hover:bg-muted/50 transition-colors",
          socialButtonsBlockButtonText: "text-foreground font-medium",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground",
          formFieldLabel: "text-foreground font-medium",
          formFieldInput: "bg-background/50 border-border text-foreground focus:ring-primary focus:border-primary",
          formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
          footerActionText: "text-muted-foreground",
          footerActionLink: "text-primary hover:text-primary/90 font-medium",
        },
      }}
    />
  );
}
