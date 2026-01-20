import { useEffect } from "react";

export function ShareButtons() {
  useEffect(() => {
    // Load AddToAny script
    const script = document.createElement("script");
    script.src = "https://static.addtoany.com/menu/page.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup might be tricky as the script adds global variable a2a
      // but usually fine to leave it or remove script tag
      document.body.removeChild(script);
    };
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
