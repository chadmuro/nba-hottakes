import { useEffect } from "react";
import toast, { resolveValue, Toaster, useToasterStore } from "react-hot-toast";

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
    <Toaster position="top-right">
      {(t) => {
        return (
          <div
            className={`absolute alert alert-${t.type} max-w-xs display justify-center`}
          >
            <p className="text-primary-content text-center">
              {resolveValue(t.message, t)}
            </p>
          </div>
        );
      }}
    </Toaster>
  );
}
