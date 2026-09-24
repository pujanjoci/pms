import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'neutral' | 'emerald' | 'amber' | 'rose' | 'sky' | 'indigo' | 'auto';
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercent = true,
  size = 'sm',
  color = 'neutral',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    xs: 'h-1.5',
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  let fillColor = 'bg-neutral-800';
  if (color === 'auto') {
    if (percentage >= 80) fillColor = 'bg-neutral-900';
    else if (percentage >= 50) fillColor = 'bg-neutral-700';
    else if (percentage >= 25) fillColor = 'bg-amber-500';
    else fillColor = 'bg-rose-500';
  } else {
    const map = {
      neutral: 'bg-neutral-900',
      emerald: 'bg-neutral-800',
      amber: 'bg-amber-500',
      rose: 'bg-rose-500',
      sky: 'bg-sky-500',
      indigo: 'bg-indigo-600',
    };
    fillColor = map[color] || 'bg-neutral-900';
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5 text-xs">
          {label && <span className="font-medium text-slate-700">{label}</span>}
          {showPercent && (
            <span className="font-semibold text-slate-900">{percentage}%</span>
          )}
        </div>
      )}
      <div className={`w-full bg-slate-100 rounded-sm overflow-hidden ${sizeClasses[size]} border border-slate-200/50`}>
        <div
          className={`${sizeClasses[size]} rounded-sm transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
