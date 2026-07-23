"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

const FOOTPRINTS = [
  { size: 160, rotate: -15, left: 8, top: 12 },
  { size: 95, rotate: -85, left: 35, top: 15 },
  { size: 120, rotate: 135, left: 45, top: 5 },
  { size: 100, rotate: 72, left: 78, top: 8 },
  { size: 150, rotate: 90, left: 15, top: 45 },
  { size: 130, rotate: 180, left: 70, top: 40 },
  { size: 105, rotate: 160, left: 50, top: 60 },
  { size: 110, rotate: 25, left: 25, top: 80 },
  { size: 90, rotate: -45, left: 5, top: 82 },
  { size: 140, rotate: 210, left: 85, top: 75 },
  { size: 80, rotate: 310, left: 60, top: 85 },
  { size: 85, rotate: 260, left: 90, top: 50 },
];

function LogoReveal() {
  return (
    <motion.div
      className="relative z-10"
      initial={{
        clipPath: "circle(0% at 50% 50%)",
        scale: 0.6,
        opacity: 0,
      }}
      animate={{
        clipPath: "circle(75% at 50% 50%)",
        scale: 1,
        opacity: 1,
      }}
      transition={{
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Image
        src="/primary-logo.svg"
        alt="Brandiha"
        width={620}
        height={153}
        priority
        className="h-auto w-[clamp(280px,70vw,620px)]"
      />
    </motion.div>
  );
}

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"loading" | "splash" | "exit" | "done">("loading");
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    const seen = sessionStorage.getItem("brandiha-splash-seen");
    requestAnimationFrame(() => setState(seen ? "done" : "splash"));
  }, []);

  useEffect(() => {
    if (state !== "splash") return;
    const timer = setTimeout(() => {
      sessionStorage.setItem("brandiha-splash-seen", "true");
      setState("exit");
    }, 3000);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (state !== "exit") return;
    const timer = setTimeout(() => setState("done"), 1000);
    return () => clearTimeout(timer);
  }, [state]);

  useEffect(() => {
    if (state === "splash" || state === "exit") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [state]);

  const showSplash = mounted && (state === "splash" || state === "exit");
  const blockInteraction = state !== "done";

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            className="fixed inset-0 z-[9999]"
            exit={{ y: "-100%" }}
            transition={{
              duration: 0.8,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            <div className="relative flex size-full items-center justify-center bg-black">
              {FOOTPRINTS.map((fp, i) => (
                <motion.div
                  key={i}
                  className="absolute pointer-events-none"
                  style={{
                    left: `${fp.left}%`,
                    top: `${fp.top}%`,
                    transform: `rotate(${fp.rotate}deg)`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: [0, 0.45, 0.2] }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.2,
                    ease: "easeOut",
                    times: [0, 0.4, 1],
                  }}
                >
                  <Image
                    src="/hand-default.svg"
                    alt=""
                    width={fp.size}
                    height={fp.size}
                    style={{
                      width: `clamp(${fp.size * 0.2}px, ${(fp.size / 16).toFixed(3)}vw, ${fp.size}px)`,
                      height: `clamp(${fp.size * 0.2}px, ${(fp.size / 16).toFixed(3)}vw, ${fp.size}px)`,
                    }}
                    priority
                  />
                </motion.div>
              ))}

              <LogoReveal />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={blockInteraction ? "pointer-events-none select-none" : ""}>
        {children}
      </div>
    </>
  );
}
