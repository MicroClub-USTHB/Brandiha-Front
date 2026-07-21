"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { cn } from "@/lib/utils";

export type PopupVariant = "success" | "error" | "warning";

interface PopupStore {
  isOpen: boolean;
  variant: PopupVariant;
  title?: string;
  description?: string;
  openPopup: (variant?: PopupVariant, title?: string, description?: string) => void;
  closePopup: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  isOpen: false,
  variant: "success",
  title: undefined,
  description: undefined,
  openPopup: (variant = "success", title, description) => set({ isOpen: true, variant, title, description }),
  closePopup: () => set({ isOpen: false }),
}));

interface PopupVariantConfig {
  imageSrc: string;
  defaultTitle: string;
  defaultDesc: string;
  primaryBtnText: string;
  showSecondary: boolean;
  secondaryBtnText?: string;
  icon: typeof Check;
  iconBg: string;
  glowColor: string;
}

const variantConfig: Record<PopupVariant, PopupVariantConfig> = {
  success: {
    imageSrc: "/green-popup.png",
    defaultTitle: "REGISTRATION SUCCESSFUL",
    defaultDesc: "THANK YOU FOR REGISTERING ! SEE YOU THERE",
    primaryBtnText: "HOME PAGE",
    showSecondary: false,
    icon: Check,
    iconBg: "bg-[#00e676]",
    glowColor: "shadow-[0_0_25px_rgba(0,230,118,0.7)]",
  },
  error: {
    imageSrc: "/red-popup.png",
    defaultTitle: "SOMETHING WENT WRONG",
    defaultDesc: "OOPS! SOMETHING WENT WRONG",
    primaryBtnText: "HOME PAGE",
    showSecondary: true,
    secondaryBtnText: "TRY AGAIN",
    icon: XCircle,
    iconBg: "bg-red-500",
    glowColor: "shadow-[0_0_25px_rgba(239,68,68,0.7)]",
  },
  warning: {
    imageSrc: "/yellow-popup.png",
    defaultTitle: "LEAVING WITHOUT SAVING",
    defaultDesc: "CHANGES ARE NOT SAVED, ARE YOU SURE YOU WANT TO LEAVE ?",
    primaryBtnText: "HOME PAGE",
    showSecondary: true,
    secondaryBtnText: "TRY AGAIN",
    icon: AlertTriangle,
    iconBg: "bg-yellow-500",
    glowColor: "shadow-[0_0_25px_rgba(234,179,8,0.7)]",
  },
};

export function Popup() {
  const router = useRouter();
  const { isOpen, variant, title, description, closePopup } = usePopupStore();

  if (!isOpen) return null;

  const config = variantConfig[variant];
  const Icon = config.icon;

  const handleHomeClick = () => {
    closePopup();
    router.push("/");
  };

  return (
    <div
      className={cn("fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm")}
      onClick={closePopup}
    >
      <div
        className={cn("relative w-full max-w-3xl flex items-center justify-center")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cn("relative w-full flex items-center justify-center")}>
          <Image
            src={config.imageSrc}
            alt="Popup Frame"
            width={950}
            height={650}
            priority
            className={cn("w-full h-auto object-contain drop-shadow-2xl pointer-events-none")}
          />

          <div className={cn("absolute inset-0 z-10 flex flex-col items-center justify-between py-12 px-20 text-center")}>
            <button
              onClick={closePopup}
              aria-label="Close"
              className={cn("absolute right-14 top-10 text-white hover:text-white/80 transition-colors")}
            >
              <X className={cn("size-6 stroke-[3]")} />
            </button>

            {/* Perfect circle icon with glow and thin vector inside */}
            <div className={cn("flex items-center justify-center w-16 h-16 rounded-full shrink-0 mt-2", config.iconBg, config.glowColor)}>
              <Icon className={cn("w-8 h-8 stroke-[1.25] text-black")} />
            </div>

            <div className={cn("flex flex-col items-center gap-2 w-full my-auto")}>
              <h2 className={cn("font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#38bdf8] drop-shadow-sm")}>
                {title || config.defaultTitle}
              </h2>
              <p className={cn("font-hand text-sm sm:text-base font-bold tracking-wider uppercase text-white/90")}>
                {description || config.defaultDesc}
              </p>
            </div>

            <div className={cn("flex items-center justify-center gap-6 w-full mb-2")}>
              {config.showSecondary && (
                <Button
                  type="button"
                  onClick={closePopup}
                  className={cn("relative h-12 -rotate-1 rounded-xl border-0 bg-transparent px-7 font-sans text-sm font-bold uppercase hover:bg-transparent")}
                >
                  <div className={cn("absolute inset-0 w-full h-full pointer-events-none scale-105 rounded-xl bg-[#333333] border-2 border-orange-500/80")} />
                  <span className={cn("relative z-10 text-white")}>
                    {config.secondaryBtnText}
                  </span>
                </Button>
              )}

              <div className={cn("relative isolate -rotate-1")}>
                <Button
                  type="button"
                  onClick={handleHomeClick}
                  className={cn("relative h-12 gap-2 rounded-xl border-0 bg-transparent px-10 text-sm font-bold uppercase hover:bg-transparent overflow-visible font-sans")}
                >
                  <div 
                    className={cn("absolute inset-0 w-full h-full pointer-events-none scale-110 rounded-xl shadow-md bg-orange-500")}
                    style={{
                      WebkitMaskImage: "url('/orange-button.png')",
                      maskImage: "url('/orange-button.png')",
                      WebkitMaskSize: "100% 100%",
                      maskSize: "100% 100%",
                      WebkitMaskRepeat: "no-repeat",
                      maskRepeat: "no-repeat",
                    }}
                  />
                  <span className={cn("relative z-10 font-extrabold text-black font-sans text-sm tracking-wider")}>
                    {config.primaryBtnText}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}