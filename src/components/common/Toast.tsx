'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { CheckCircle2 } from 'lucide-react';

export function Toast() {
  const { toastMessage } = useProject();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 pointer-events-none">
      <div className="flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-sm shadow-xl text-sm font-medium border border-slate-700/80">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
