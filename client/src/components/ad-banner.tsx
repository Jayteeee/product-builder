import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface AdBannerProps {
  className?: string;
  dataAdSlot?: string;
  dataAdFormat?: string;
  dataFullWidthResponsive?: boolean;
}

export function AdBanner({ 
  className,
  dataAdSlot = "YOUR_AD_SLOT_ID", // User should replace this
  dataAdFormat = "auto",
  dataFullWidthResponsive = true
}: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If we are not rendering the ad unit (because slot ID is missing), 
    // we should NOT push a request to AdSense.
    if (dataAdSlot === "YOUR_AD_SLOT_ID") return;

    // This is where you would initialize the ad if needed for SPA
    // For AdSense, usually just the script tag in index.html + the ins tag here is enough
    // provided the script is loaded.
    try {
      // @ts-ignore
      if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, [dataAdSlot]);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={cn("ad-banner w-full rounded-lg flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border/50 bg-muted/10 min-h-[100px] p-4", className)}>
        <span className="font-bold text-sm">광고 영역 (AdSense)</span>
        <span className="text-xs">실제 배포 시 광고가 표시됩니다.</span>
      </div>
    );
  }

  // Safety check: If the user hasn't provided a specific Slot ID yet, 
  // do not render the manual ad unit to prevent 400 errors.
  // The page will still rely on the Auto Ads script in index.html.
  if (dataAdSlot === "YOUR_AD_SLOT_ID") {
    return null;
  }

  return (
    <div className={cn("ad-container my-4 overflow-hidden text-center", className)} ref={adRef}>
      <ins className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-9065869497785181"
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive ? "true" : "false"}></ins>
    </div>
  );
}