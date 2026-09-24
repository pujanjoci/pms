import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  onClick,
  hover = false,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-sm border border-slate-200 shadow-sm transition-colors ${hover ? 'hover:border-slate-300 cursor-pointer' : ''
        } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  icon,
  className = '',
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="h-9 w-9 rounded-sm bg-neutral-100 text-neutral-700 flex items-center justify-center shrink-0 border border-neutral-100">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-neutral-900 text-sm sm:text-base leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`p-4 sm:p-5 bg-slate-50 rounded-b-lg border-t border-slate-200 ${className}`}>
      {children}
    </div>
  );
}
