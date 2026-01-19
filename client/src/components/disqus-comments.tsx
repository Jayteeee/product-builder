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
      // Cleanup if necessary, though Disqus is tricky to unmount completely
      // Usually checking if the script exists is enough to prevent duplicates
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="mt-8 pt-8 border-t border-border/50">
      <div id="disqus_thread" className="min-h-[200px]"></div>
      <noscript>
        Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
      </noscript>
    </div>
  );
}
