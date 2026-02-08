"use client";

import { useEffect, useState } from "react";

const videos = [
  "/videos/live.mp4"
];

export function VideoSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((p) => (p + 1) % videos.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl aspect-video shadow-soft bg-black">
      {videos.map((src, i) => (
        <video
          key={src}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"
            }`}
        />
      ))}
    </div>
  );
}
