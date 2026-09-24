'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronDown,
  Check,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  Sparkles,
  X,
  Kanban,
  ShieldAlert,
  GitPullRequest,
  CheckSquare2,
  FolderKanban,
} from 'lucide-react';
import { Badge } from '@/components/common/Badge';

export function Header() {
  const {
    project,
    projectsList,
    activeProjectId,
    setActiveProjectId,
    searchQuery,
    setSearchQuery,
    setIsMobileSidebarOpen,
    openModal,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    isNotificationsOpen,
    setIsNotificationsOpen,
    setCurrentView,
  } = useProject();

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);

  const quickActionRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const projectSwitcherRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        quickActionRef.current &&
        !quickActionRef.current.contains(e.target as Node)
      ) {
        setIsQuickActionOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
      if (
        projectSwitcherRef.current &&
        !projectSwitcherRef.current.contains(e.target as Node)
      ) {
        setIsProjectSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsNotificationsOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filter tasks & risks based on search query (safe when project is empty)
  const matchingTasks = searchQuery.trim()
    ? (project.kanbanTasks ?? []).filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  const matchingRisks = searchQuery.trim()
    ? (project.risks ?? []).filter((r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.code.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : [];

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 select-none">
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left side: Mobile menu toggle + Project Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-sm text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 shrink-0"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Project Switcher Dropdown */}
          {projectsList.length > 0 && (
            <div className="relative min-w-0" ref={projectSwitcherRef}>
              <button
                onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
                className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-sm border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-xs font-semibold text-neutral-700 transition-colors max-w-[140px] sm:max-w-[200px]"
                title="Switch active project"
              >
                <FolderKanban className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                <span className="truncate">{project.name || 'Select Project'}</span>
                <ChevronDown
                  className={`h-3 w-3 text-neutral-400 shrink-0 transition-transform duration-200 ${isProjectSwitcherOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isProjectSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-64 max-w-[85vw] bg-white rounded-sm shadow-lg border border-neutral-200 py-1.5 z-50 overflow-hidden">
                  <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-b border-neutral-100 mb-1">
                    Switch Project
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {projectsList.map((p) => {
                      const isActive = p.id === activeProjectId;
                      const statusColor =
                        p.status === 'On Track'
                          ? 'bg-neutral-100 text-neutral-800'
                          : p.status === 'At Risk'
                            ? 'bg-amber-100 text-amber-700'
                            : p.status === 'Completed'
                              ? 'bg-sky-100 text-sky-700'
                              : 'bg-rose-100 text-rose-700';
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveProjectId(p.id);
                            setCurrentView('dashboard');
                            setIsProjectSwitcherOpen(false);
                          }}
                          className={`w-full px-3 py-2.5 flex items-center justify-between gap-2.5 text-left text-xs transition-colors ${isActive
                            ? 'bg-neutral-100 text-neutral-900 font-semibold'
                            : 'text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900'
                            }`}
                        >
                          <p className="font-semibold truncate flex-1">{p.name}</p>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${statusColor}`}>
                              {p.status}
                            </span>
                            {isActive && (
                              <Check className="h-3.5 w-3.5 text-neutral-900" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-neutral-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        openModal('create-project');
                        setIsProjectSwitcherOpen(false);
                      }}
                      className="w-full px-3 py-2 flex items-center gap-2 text-left text-xs font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      New Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Global Search Bar (Desktop) */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, risks, team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-neutral-50 hover:bg-neutral-100/70 focus:bg-white border border-neutral-200 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-sm shadow-2xl border border-neutral-200 p-2 z-50 max-h-80 overflow-y-auto">
              <div className="text-[11px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                Search Results
              </div>

              {matchingTasks.length === 0 && matchingRisks.length === 0 ? (
                <p className="text-xs text-neutral-500 px-2 py-3 text-center">
                  No matching tasks or risks found for &quot;{searchQuery}&quot;
                </p>
              ) : (
                <div className="space-y-1">
                  {matchingTasks.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setCurrentView('kanban');
                        setSearchQuery('');
                      }}
                      className="p-2 rounded-sm hover:bg-neutral-50 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Kanban className="h-3.5 w-3.5 text-neutral-700" />
                        <span className="font-medium text-neutral-800">{t.title}</span>
                      </div>
                      <Badge variant="neutral" size="sm">
                        {t.column.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {matchingRisks.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setCurrentView('risks');
                        setSearchQuery('');
                      }}
                      className="p-2 rounded-sm hover:bg-neutral-50 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
                        <span className="font-medium text-neutral-800">{r.title}</span>
                      </div>
                      <Badge variant="warning" size="sm">
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Mobile Search Toggle + Quick "New" Action */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle Button */}
          <button
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            className="sm:hidden p-2 rounded-sm text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 transition-colors"
            aria-label="Toggle mobile search"
          >
            {isMobileSearchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </button>
          {/* "+ New" Action Button */}
          <div className="relative" ref={quickActionRef}>
            <button
              onClick={() => setIsQuickActionOpen(!isQuickActionOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New</span>
              <ChevronDown className="h-3 w-3 opacity-80" />
            </button>

            {isQuickActionOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-sm shadow-lg border border-neutral-200 py-1.5 z-40">
                <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Projects
                </div>
                <button
                  onClick={() => {
                    openModal('create-project');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Layers className="h-4 w-4 text-neutral-700" />
                  <span>New Project</span>
                </button>
                <div className="px-3 py-1 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider border-t border-neutral-100 mt-1 pt-2">
                  Create Project Item
                </div>
                <button
                  onClick={() => {
                    openModal('add-task');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <Kanban className="h-4 w-4 text-neutral-700" />
                  <span>New Project Task</span>
                </button>
                <button
                  onClick={() => {
                    openModal('add-risk');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Log New Risk</span>
                </button>
                <button
                  onClick={() => {
                    openModal('add-change');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <GitPullRequest className="h-4 w-4 text-sky-600" />
                  <span>Change Request</span>
                </button>
                <button
                  onClick={() => {
                    openModal('add-issue');
                    setIsQuickActionOpen(false);
                  }}
                  className="w-full px-3 py-2 flex items-center gap-2.5 text-left text-xs font-medium text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                >
                  <CheckSquare2 className="h-4 w-4 text-rose-500" />
                  <span>Log Quality Defect</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Input Drawer (Expandable) */}
      {isMobileSearchOpen && (
        <div className="sm:hidden px-3 pb-3 pt-1 border-t border-neutral-100 bg-neutral-50 animate-in slide-in-from-top-2 duration-150">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks, risks, team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-neutral-300 rounded-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500/20 focus:border-neutral-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Mobile Search Results */}
          {searchQuery.trim().length > 0 && (
            <div className="mt-2 bg-white rounded-sm shadow-md border border-neutral-200 p-2 max-h-60 overflow-y-auto">
              <div className="text-[10px] font-semibold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                Search Results
              </div>
              {matchingTasks.length === 0 && matchingRisks.length === 0 ? (
                <p className="text-xs text-neutral-500 px-2 py-2 text-center">
                  No matching tasks or risks found
                </p>
              ) : (
                <div className="space-y-1">
                  {matchingTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        setCurrentView('kanban');
                        setSearchQuery('');
                        setIsMobileSearchOpen(false);
                      }}
                      className="p-2 rounded-sm hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Kanban className="h-3.5 w-3.5 text-neutral-700 shrink-0" />
                        <span className="font-medium text-neutral-800 truncate">{t.title}</span>
                      </div>
                      <Badge variant="neutral" size="sm" className="shrink-0">
                        {t.column.replace('_', ' ')}
                      </Badge>
                    </div>
                  ))}
                  {matchingRisks.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setCurrentView('risks');
                        setSearchQuery('');
                        setIsMobileSearchOpen(false);
                      }}
                      className="p-2 rounded-sm hover:bg-neutral-50 active:bg-neutral-100 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-neutral-800 truncate">{r.title}</span>
                      </div>
                      <Badge variant="warning" size="sm" className="shrink-0">
                        {r.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
