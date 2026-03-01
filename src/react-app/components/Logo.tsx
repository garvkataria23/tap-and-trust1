import { cn } from "@/react-app/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
}

export default function Logo({ size = "md", className, showText = false }: LogoProps) {
  const sizes = {
    sm: "w-12 h-12",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const containerClasses = showText ? "flex flex-col items-center gap-3" : "";

  return (
    <div className={cn(containerClasses, className)}>
      <div className={cn("relative", sizes[size])}>
        <img
          src="/logo.svg"
          alt="Tap & Trust Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="text-center">
          <h2 className={cn("font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent", textSizes[size])}>
            Tap & Trust
          </h2>
        </div>
      )}
    </div>
  );
}
