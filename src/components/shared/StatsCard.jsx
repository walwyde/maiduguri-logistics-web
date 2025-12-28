import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const variantStyles = {
  primary: {
    iconBg: 'bg-status-pending-bg',
    iconColor: 'text-primary',
  },
  success: {
    iconBg: 'bg-status-completed-bg',
    iconColor: 'text-success',
  },
  warning: {
    iconBg: 'bg-status-active-bg',
    iconColor: 'text-warning',
  },
  default: {
    iconBg: 'bg-secondary',
    iconColor: 'text-foreground',
  },
};

export function StatsCard({ title, value, subtitle, icon: Icon, variant = 'default' }) {
  const styles = variantStyles[variant];

  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', styles.iconBg)}>
          <Icon className={cn('w-6 h-6', styles.iconColor)} />
        </div>
        <span className="text-2xl font-bold text-foreground">{value}</span>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
