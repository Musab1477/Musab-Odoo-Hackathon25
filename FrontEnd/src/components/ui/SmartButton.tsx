import { cn } from '@/lib/utils';

interface SmartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  badge?: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SmartButton({ badge, icon, children, className, ...props }: SmartButtonProps) {
  return (
    <button
      className={cn("smart-button", className)}
      {...props}
    >
      {icon}
      <span>{children}</span>
      {badge !== undefined && badge > 0 && (
        <span className="smart-button-badge">{badge}</span>
      )}
    </button>
  );
}
