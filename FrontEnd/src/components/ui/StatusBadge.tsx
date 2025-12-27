import { cn } from '@/lib/utils';
import { RequestStatus, Priority } from '@/types';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusClass = {
    'New': 'status-new',
    'In Progress': 'status-in-progress',
    'Repaired': 'status-repaired',
    'Scrap': 'status-scrap',
  }[status];

  return (
    <span className={cn('status-badge', statusClass, className)}>
      {status}
    </span>
  );
}

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const priorityStyles = {
    'Low': 'bg-muted text-muted-foreground',
    'Medium': 'bg-blue-100 text-blue-700',
    'High': 'bg-orange-100 text-orange-700',
    'Critical': 'bg-red-100 text-red-700',
  }[priority];

  return (
    <span className={cn('status-badge', priorityStyles, className)}>
      {priority}
    </span>
  );
}
