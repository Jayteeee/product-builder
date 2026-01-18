import { cn } from "@/lib/utils";
import { Megaphone } from "lucide-react";

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  return (
    <div className={cn("ad-banner rounded-lg flex items-center justify-center text-muted-foreground border border-dashed border-border/50 bg-muted/10", className)}>
      <Megaphone className="w-4 h-4 mr-2" />
      <span className="text-sm">광고 배너 영역</span>
    </div>
  );
}
