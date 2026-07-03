export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[40%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -bottom-[40%] -left-[40%] w-[80%] h-[80%] rounded-full bg-primary/10 blur-[120px]" />
      </div>
      <div className="z-10">
        {children}
      </div>
    </div>
  );
}
