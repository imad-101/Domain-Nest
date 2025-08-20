interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between py-6">
      <div className="space-y-2">
        <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text font-heading text-4xl font-bold tracking-tight text-transparent">
          {heading}
        </h1>
        {text && (
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {text}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
