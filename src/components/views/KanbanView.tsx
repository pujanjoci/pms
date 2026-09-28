'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  Plus,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { KanbanTask } from '@/types/project';

export function KanbanView() {
  const {
    project,
    moveKanbanTask,
    openModal,
  } = useProject();

  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('All');
  const [activeMobileTab, setActiveMobileTab] = useState<string>('all');

  // Filter tasks
  const filteredTasks = (project.kanbanTasks ?? []).filter((task) => {
    if (selectedPriority !== 'All' && task.priority !== selectedPriority) return false;
    if (selectedAssignee !== 'All' && task.assigneeId !== selectedAssignee) return false;
    return true;
  });

  const columns: { id: KanbanTask['column']; label: string; headerColor: string }[] = [
    { id: 'todo', label: 'To Do', headerColor: 'border-slate-300 text-slate-700' },
    { id: 'in_progress', label: 'In Progress', headerColor: 'border-amber-400 text-amber-800' },
    { id: 'in_review', label: 'In Review', headerColor: 'border-sky-400 text-sky-800' },
    { id: 'done', label: 'Done', headerColor: 'border-emerald-500 text-emerald-800' },
  ];

  const getAssignee = (id: string) => {
    const members = project.teamMembers ?? [];
    return (
      members.find((m) => m.id === id) ||
      members[0] || { name: 'Unassigned', role: '', initials: '?' }
    );
  };

  const getNextColumn = (current: KanbanTask['column']): KanbanTask['column'] | null => {
    if (current === 'todo') return 'in_progress';
    if (current === 'in_progress') return 'in_review';
    if (current === 'in_review') return 'done';
    return null;
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate max-w-[140px] sm:max-w-none">{project.name}</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Kanban Board</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Kanban Board
            </h1>
            {/* <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active sprint work packages, stage transitions, individual workload tracking, and deliverable burndown.
            </p> */}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Priority Filter */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Assignee Filter */}
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 sm:py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-neutral-500"
            >
              <option value="All">All Team Members</option>
              {(project.teamMembers ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => openModal('add-task')}
              className="px-3 py-1.5 sm:py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-sm shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Lane Selector Tabs */}
      <div className="sm:hidden flex items-center gap-1.5 overflow-x-auto pb-1 -mx-3 px-3 no-scrollbar">
        <button
          onClick={() => setActiveMobileTab('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeMobileTab === 'all'
            ? 'bg-neutral-900 text-white'
            : 'bg-white text-slate-600 border border-slate-200'
            }`}
        >
          All Lanes ({filteredTasks.length})
        </button>
        {columns.map((col) => {
          const count = filteredTasks.filter((t) => t.column === col.id).length;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileTab(col.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeMobileTab === col.id
                ? 'bg-neutral-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
                }`}
            >
              {col.label} ({count})
            </button>
          );
        })}
      </div>

      {/* 4 KANBAN COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {columns.map((col) => {
          if (activeMobileTab !== 'all' && activeMobileTab !== col.id) {
            return null;
          }
          const colTasks = filteredTasks.filter((t) => t.column === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-100/70 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${col.id === 'done'
                      ? 'bg-emerald-500'
                      : col.id === 'in_review'
                        ? 'bg-sky-500'
                        : col.id === 'in_progress'
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                  />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    {col.label}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="flex-1 space-y-3">
                {colTasks.length === 0 ? (
                  <div className="h-32 rounded-xl border border-dashed border-slate-300/80 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                    <span>No tasks in this lane</span>
                  </div>
                ) : (
                  colTasks.map((task) => {
                    const assignee = getAssignee(task.assigneeId);
                    const nextCol = getNextColumn(task.column);

                    return (
                      <Card
                        key={task.id}
                        className="p-3.5 bg-white border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2.5 group"
                      >
                        {/* Top: Priority & Stage Changer */}
                        <div className="flex items-center justify-between gap-1">
                          <Badge
                            variant={
                              task.priority === 'Urgent'
                                ? 'danger'
                                : task.priority === 'High'
                                  ? 'danger'
                                  : task.priority === 'Medium'
                                    ? 'warning'
                                    : 'neutral'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>

                          {/* Quick Stage Dropdown */}
                          <select
                            value={task.column}
                            onChange={(e) =>
                              moveKanbanTask(task.id, e.target.value as KanbanTask['column'])
                            }
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-neutral-500 cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="in_review">In Review</option>
                            <option value="done">Done</option>
                          </select>
                        </div>

                        {/* Title & Description */}
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>

                        {/* Tags */}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Bottom: Assignee, Hours, Advance button */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <div
                              title={`${assignee.name} (${assignee.role})`}
                              className="h-6 w-6 rounded-md bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[10px] flex items-center justify-center font-mono"
                            >
                              {assignee.initials || assignee.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="leading-tight">
                              <span className="text-[11px] font-medium text-slate-700 block truncate max-w-[120px]" title={assignee.name}>
                                {assignee.name}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-[11px] font-mono flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {task.dueDate}
                            </span>

                            {nextCol && (
                              <button
                                onClick={() => moveKanbanTask(task.id, nextCol)}
                                title={`Advance to ${nextCol.replace('_', ' ')}`}
                                className="p-1 rounded text-neutral-700 hover:bg-neutral-100 transition-colors"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>

              {/* Quick Add at bottom of column */}
              <button
                onClick={() => openModal('add-task')}
                className="mt-3 py-2 w-full text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/80 rounded-xl border border-dashed border-slate-300 transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add to {col.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
