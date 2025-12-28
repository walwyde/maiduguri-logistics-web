import { cn } from '@/lib/utils';


const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-status-pending-bg text-primary',
  },
  accepted: {
    label: 'Accepted',
    className: 'bg-status-pending-bg text-primary',
  },
  in_transit: {
    label: 'In Transit',
    className: 'bg-status-active-bg text-warning',
  },
  delivered: {
    label: 'Delivered',
    className: 'bg-status-completed-bg text-success',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-status-cancelled-bg text-destructive',
  },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={cn('inline-flex px-3 py-1 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
