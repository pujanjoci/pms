'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { useProject, ViewType } from '@/context/ProjectContext';
import {
  LayoutDashboard,
  FileText,
  CalendarDays,
  DollarSign,
  AlertTriangle,
  Users2,
  CheckSquare2,
  GitPullRequest,
  Users,
  Kanban,
  FileCheck,
  Settings,
  X,
  LogIn,
  LogOut,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
}

export function Sidebar() {
  const {
    currentView,
    setCurrentView,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    project,
    authUser,
    openAuthModal,
    logout,
  } = useProject();

  const activeRiskCount = (project.risks ?? []).filter(
    (r) => r.status === 'Monitoring' || r.status === 'Open'
  ).length;

  const pendingChangesCount = (project.changeRequests ?? []).filter(
    (c) => c.status === 'Pending Approval'
  ).length;

  const openBugsCount = (project.issues ?? []).filter(
    (i) => i.status !== 'Resolved'
  ).length;

  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'overview', label: 'Project Overview', icon: FileText },
    { id: 'schedule', label: 'Schedule & Timeline', icon: CalendarDays },
    { id: 'budget', label: 'Budget & Resources', icon: DollarSign },
    {
      id: 'risks',
      label: 'Risk Register',
      icon: AlertTriangle,
      badge: activeRiskCount > 0 ? activeRiskCount : undefined,
      badgeVariant: 'danger',
    },
    { id: 'stakeholders', label: 'Stakeholders & Comm', icon: Users2 },
    {
      id: 'quality',
      label: 'Quality & Issues',
      icon: CheckSquare2,
      badge: openBugsCount > 0 ? openBugsCount : undefined,
      badgeVariant: 'warning',
    },
    {
      id: 'changes',
      label: 'Change Management',
      icon: GitPullRequest,
      badge: pendingChangesCount > 0 ? pendingChangesCount : undefined,
      badgeVariant: 'info',
    },
    { id: 'team', label: 'Team & RACI', icon: Users },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'final-report', label: 'Final Report & Recs', icon: FileCheck },
    { id: 'admin', label: 'Admin & System Reset', icon: Settings },
  ];

  const handleNavClick = (viewId: ViewType) => {
    setCurrentView(viewId);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="relative flex flex-col h-full bg-white border-r border-neutral-200 select-none">
      {/* Mobile close button */}
      <button
        onClick={() => setIsMobileSidebarOpen(false)}
        className="lg:hidden absolute top-3 right-3 z-20 p-1.5 rounded-sm text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Mini Project Progress Pill */}
      {project.name ? (
        <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-medium text-neutral-600 truncate max-w-[150px]">
              {project.name}
            </span>
            <span className="font-bold text-neutral-900">{project.progress ?? 0}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-sm h-1.5 overflow-hidden">
            <div
              className="bg-neutral-900 h-1.5 rounded-sm transition-all duration-500"
              style={{ width: `${project.progress ?? 0}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100">
          <p className="text-xs text-neutral-400 italic">No active project</p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        <div className="px-3 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Management Sections
        </div>
        {navItems.filter((item) => item.id !== 'admin' || authUser?.isManager).map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-xs font-medium transition-all duration-150 group ${isActive
                ? 'bg-neutral-100 text-neutral-900 font-semibold shadow-xs border border-neutral-200'
                : 'text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900'
                }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-neutral-900' : 'text-neutral-400 group-hover:text-neutral-600'
                    }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <Badge
                  variant={item.badgeVariant || 'neutral'}
                  size="sm"
                  className="shrink-0"
                >
                  {item.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom User*/}
      <div className="p-3 border-t border-neutral-100 bg-neutral-50/50 space-y-2">
        <div className="flex items-center gap-2.5 p-2 rounded-sm bg-white border border-neutral-200 shadow-sm">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-neutral-800 truncate">
              {authUser?.isManager ? authUser.name : 'Guest Visitor'}
            </p>
            <p className="text-[11px] text-neutral-500 truncate">
              {authUser?.isManager ? authUser.role : 'Read-Only Mode'}
            </p>
          </div>
          {authUser?.isManager ? (
            <button
              onClick={logout}
              className="p-1 rounded-sm text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={openAuthModal}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-sm flex items-center gap-1 transition-colors shrink-0"
              title="Log In as Manager"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop: always visible sticky sidebar ── */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* ── Mobile: portal the drawer outside the app's clipped layout ── */}
      {createPortal(
        <>
          <div
            className={`lg:hidden fixed inset-0 z-[100] bg-neutral-900/50 backdrop-blur-sm transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            onClick={() => setIsMobileSidebarOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation sidebar"
            aria-hidden={!isMobileSidebarOpen}
            className={`lg:hidden fixed inset-y-0 left-0 h-[100dvh] max-h-screen w-72 max-w-[85vw] z-[101] shadow-2xl
              transform transition-transform duration-300 ease-in-out
              ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full pointer-events-none'}`}
          >
            {sidebarContent}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
