import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, AlertCircle } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center gap-3">
              {variant === "destructive" ? (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-destructive" />
                </div>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="grid gap-0.5">
                {title && <ToastTitle className="font-semibold">{title}</ToastTitle>}
                {description && <ToastDescription className="text-sm opacity-80">{description}</ToastDescription>}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
