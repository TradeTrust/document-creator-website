import { useEffect } from "react";

interface GoogleTagManagerProps {
  /** GTM container ID — e.g. GTM-XXXXXXX */
  gtmContainerId?: string;
}

/**
 * Bootstraps GTM on mount by injecting the gtm.js script into <head>.
 * Renders nothing. The GTM noscript fallback lives in index.html so it works
 * before JavaScript runs.
 */
export const GoogleTagManager = ({ gtmContainerId }: GoogleTagManagerProps): null => {
  useEffect(() => {
    if (!gtmContainerId || document.getElementById("gtm-script")) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.id = "gtm-script";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmContainerId}`;
    document.head.appendChild(script);
  }, [gtmContainerId]);

  return null;
};
