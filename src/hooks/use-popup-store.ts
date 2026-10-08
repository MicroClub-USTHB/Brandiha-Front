import { create } from "zustand";

export type PopupVariant = "success" | "error" | "warning";

interface PopupStore {
  isOpen: boolean;
  variant: PopupVariant;
  title?: string;
  description?: string;
  openPopup: (variant?: PopupVariant, title?: string, description?: string) => void;
  closePopup: () => void;
}

/**
 * Open/close state for the app's one `<Popup />`. Kept apart from the component
 * so logic that only opens it — `useRegistrationForm` — doesn't have to import
 * a component module to do so.
 */
export const usePopupStore = create<PopupStore>((set) => ({
  isOpen: false,
  variant: "success",
  title: undefined,
  description: undefined,
  openPopup: (variant = "success", title, description) =>
    set({ isOpen: true, variant, title, description }),
  closePopup: () => set({ isOpen: false }),
}));
