import { useEffect, useRef } from "react";

declare global {
  interface Window {
    a2a?: {
      init: (type: string) => void;
    };
    a2a_config?: any;
  }
}

export function ShareButtons() {
  const isLoaded = useRef(false);

  useEffect(() => {
    // Configure AddToAny
    window.a2a_config = window.a2a_config || {};
    window.a2a_config.onclick = 1; // Enable click tracking if needed
    window.a2a_config.num_services = 8; // Number of services to show

    if (!document.getElementById("a2a-script")) {
      const script = document.createElement("script");
      script.id = "a2a-script";
      script.src = "https://static.addtoany.com/menu/page.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        isLoaded.current = true;
      };
      document.body.appendChild(script);
    } else if (window.a2a) {
      // If script is already loaded, re-initialize
      try {
        window.a2a.init("page");
      } catch (e) {
        console.error("AddToAny init error", e);
      }
    }

    // Cleanup not typically needed for this singleton script
  }, []);

  return (
    <div className="flex justify-center my-4">
      {/* AddToAny BEGIN */}
      <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
        <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
        <a className="a2a_button_copy_link"></a>
        <a className="a2a_button_email"></a>
        <a className="a2a_button_sms"></a>
        <a className="a2a_button_kakao"></a>
        <a className="a2a_button_facebook"></a>
        <a className="a2a_button_x"></a>
        <a className="a2a_button_threads"></a>
        <a className="a2a_button_linkedin"></a>
      </div>
      {/* AddToAny END */}
    </div>
  );
}
