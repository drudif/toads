"use client";

import { useEffect, useState } from "react";

const IFRAME_SOURCES = [
  "https://app.endlesstools.io/embed/d104dc9c-2387-48c2-83b6-56aedbd87aa5",
  "https://app.endlesstools.io/embed/93cb3bf0-2f34-4332-813c-6c8b9c3f5935",
  "https://app.endlesstools.io/embed/3fdf760d-1b21-4385-9c73-c0e0d51a7d49",
  "https://app.endlesstools.io/embed/6743c849-6066-4cf5-980a-7cca19bb17ef",
  "https://app.endlesstools.io/embed/c3757db4-d253-441c-8c27-f331f918dba9",
];

const STORAGE_KEY = "toads_iframe_index";

export default function IframeBackground() {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    const current = parseInt(localStorage.getItem(STORAGE_KEY) ?? "0", 10);
    const next = (current + 1) % IFRAME_SOURCES.length;
    localStorage.setItem(STORAGE_KEY, String(next));
    setSrc(IFRAME_SOURCES[current]);
  }, []);

  if (!src) return null;

  return (
    <div className="fixed" style={{ zIndex: 0, top: "-60px", left: 0, right: 0, bottom: 0 }}>
      <iframe
        {...{ allowtransparency: "true" }}
        style={{
          width: "168%",
          height: "168%",
          backgroundColor: "transparent",
          border: "none",
          display: "block",
          transform: "scale(0.595)",
          transformOrigin: "top left",
        }}
        src={src}
        title="Endless Tools Background"
        frameBorder="0"
        allow="clipboard-write; encrypted-media; gyroscope; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
