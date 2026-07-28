"use client";

import { useRouter } from "next/navigation";
import { X, Check, AlertTriangle, XCircle } from "lucide-react";
import { ActionButton } from "@/components/action-button";
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
        className={cn("relative w-full max-w-md sm:max-w-3xl")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* The frame is a background stretched to the content box, so it grows
            with the content instead of being scaled by width (which left it far
            too short for the text on mobile). */}
        <div
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 sm:gap-5 px-[13%] py-12 sm:py-16 text-center drop-shadow-2xl",
          )}
          style={{
            backgroundImage: `url('${config.imageSrc}')`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <button
            onClick={closePopup}
            aria-label="Close"
            className={cn("absolute right-[8%] top-[9%] text-white hover:text-white/80 transition-colors")}
          >
            <X className={cn("size-5 sm:size-6 stroke-[3]")} />
          </button>

          {/* Perfect circle icon with glow and thin vector inside */}
          <div className={cn("flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full shrink-0", config.iconBg, config.glowColor)}>
            <Icon className={cn("w-7 h-7 sm:w-8 sm:h-8 stroke-[1.25] text-black")} />
          </div>

          <div className={cn("flex flex-col items-center gap-2 w-full")}>
            <h2 className={cn("font-heading text-xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#38bdf8] drop-shadow-sm")}>
              {title || config.defaultTitle}
            </h2>
            <p className={cn("font-hand text-xs sm:text-base font-bold tracking-wider uppercase text-white/90")}>
              {description || config.defaultDesc}
            </p>
          </div>

          <div className={cn("flex items-center justify-center gap-4 sm:gap-12 w-full mt-2 sm:mt-6")}>
            {config.showSecondary && (
              <ActionButton
                variant="secondary"
                type="button"
                onClick={closePopup}
                className={cn("h-10 sm:h-12 -rotate-1 px-5 sm:px-7 text-xs sm:text-sm")}
              >
                {config.secondaryBtnText}
              </ActionButton>
            )}

            <ActionButton
              variant="primary"
              type="button"
              onClick={handleHomeClick}
              className={cn("h-10 sm:h-12 -rotate-1 px-6 sm:px-10 text-xs sm:text-sm tracking-wider")}
            >
              {config.primaryBtnText}
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}