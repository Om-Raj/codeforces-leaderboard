import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
  duration?: number;
  id?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const showToast = (
    message: string,
    type: ToastType = "info",
    options?: ToastOptions,
  ) => {
    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
      default:
        toast(message, options);
        break;
    }
  };

  return {
    toast: showToast,
    success: (message: string, options?: ToastOptions) =>
      showToast(message, "success", options),
    error: (message: string, options?: ToastOptions) =>
      showToast(message, "error", options),
    warning: (message: string, options?: ToastOptions) =>
      showToast(message, "warning", options),
    info: (message: string, options?: ToastOptions) =>
      showToast(message, "info", options),
  };
};
