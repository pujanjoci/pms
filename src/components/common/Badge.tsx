import React from 'react';

export type BadgeVariant =
  | 'success' // emerald/green
  | 'warning' // amber/yellow
  | 'danger' // red
  | 'info' // blue/sky
  | 'purple' // purple
  | 'neutral' // slate/gray
  | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-sm px-3 py-1 font-semibold',
  };

  const variantClasses: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      dot: 'bg-emerald-500',
    },
    warning: {
      container: 'bg-amber-50 text-amber-800 border border-amber-200/80',
      dot: 'bg-amber-500',
    },
    danger: {
      container: 'bg-rose-50 text-rose-700 border border-rose-200/80',
      dot: 'bg-rose-500',
    },
    info: {
      container: 'bg-sky-50 text-sky-700 border border-sky-200/80',
      dot: 'bg-sky-500',
    },
    purple: {
      container: 'bg-purple-50 text-purple-700 border border-purple-200/80',
      dot: 'bg-purple-500',
    },
    neutral: {
      container: 'bg-slate-100 text-slate-700 border border-slate-200/80',
      dot: 'bg-slate-400',
    },
    outline: {
      container: 'bg-white text-slate-700 border border-slate-300',
      dot: 'bg-slate-400',
    },
  };

  const selected = variantClasses[variant] || variantClasses.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-sm transition-colors ${sizeClasses[size]} ${selected.container} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${selected.dot}`} />}
      {children}
    </span>
  );
}
