import { useEffect } from "react";
import toast, { Toaster, useToasterStore } from "react-hot-toast";

const TOAST_LIMIT = 3;

export default function ToasterComponent() {
  // Used to limit the amount of toasts displayed to 3
  const { toasts } = useToasterStore();
  useEffect(() => {
    toasts
      .filter((t) => t.visible)
      .filter((_, i) => i >= TOAST_LIMIT)
      .forEach((t) => toast.dismiss(t.id));
  }, [toasts]);

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          color: "#fff",
          fontSize: "16px",
        },
      }}
    />
  );
}
