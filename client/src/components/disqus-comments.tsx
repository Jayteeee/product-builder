import { useEffect } from "react";
import { useTheme } from "@/components/theme-provider";

export function DisqusComments() {
  const { theme } = useTheme();

  useEffect(() => {
    // Basic Disqus script injection
    const script = document.createElement("script");
    script.src = "https://product-builder-6.disqus.com/embed.js";
    script.setAttribute("data-timestamp", Date.now().toString());
    script.async = true;

    // Append to body or head
    const target = document.body || document.head;
    target.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Also try to clean up the iframe if possible
      const iframe = document.querySelector('iframe[title="Disqus"]');
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
      }
    };
  }, [theme]); // Re-run when theme changes

  return (
    <div className="mt-8 pt-8 border-t border-border/50">
      <div 
        key={theme} 
        id="disqus_thread" 
        className="min-h-[200px] bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl"
      ></div>
      <noscript>
        Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  );
}
