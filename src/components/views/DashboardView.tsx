'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Bug,
  DollarSign,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Kanban,
  Users,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { KanbanTask } from '@/types/project';

export function DashboardView() {
  const {
    project,
    setCurrentView,
    moveKanbanTask,
    openModal,
  } = useProject();

  const kanbanTasks = project.kanbanTasks ?? [];
  const risks = project.risks ?? [];
  const changeRequests = project.changeRequests ?? [];
  const teamMembers = project.teamMembers ?? [];

  const totalTasks = kanbanTasks.length;
  const completedTasks = kanbanTasks.filter((t) => t.column === 'done').length;
  const inProgressTasks = kanbanTasks.filter((t) => t.column === 'in_progress').length;
  const reviewTasks = kanbanTasks.filter((t) => t.column === 'in_review').length;
  const todoTasks = kanbanTasks.filter((t) => t.column === 'todo').length;

  const activeRisks = risks.filter(
    (r) => r.status === 'Monitoring' || r.status === 'Open'
  ).length;

  const budgetUsedPercent = project.totalBudget
    ? Math.round((project.spentBudget / project.totalBudget) * 100)
    : 0;

  // Helper to get assignee — safe fallback when member not found
  const getAssignee = (id: string) => {
    return (
      teamMembers.find((m) => m.id === id) ||
      teamMembers[0] || { name: 'Unassigned', role: '', initials: '?' }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner / Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="text-slate-700 font-medium">Project's Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {project.name}
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openModal('add-task')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-sm shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Task
          </button>
        </div>
      </div>

      {/* TOP KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Overall Progress */}
        <Card
          hover
          onClick={() => setCurrentView('overview')}
          className="p-4 bg-white border-neutral-200"
        >
          <div className="text-slate-500 text-xs mb-1.5">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Progress
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {project.progress}%
          </div>
          <div className="mt-2">
            <ProgressBar value={project.progress} color="neutral" size="xs" showPercent={false} />
          </div>
        </Card>

        {/* Tasks Completed */}
        <Card
          hover
          onClick={() => setCurrentView('kanban')}
          className="p-4"
        >
          <div className="text-slate-500 text-xs mb-1.5">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Tasks Done
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            {completedTasks}/{totalTasks}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {inProgressTasks} in development
          </p>
        </Card>

        {/* Upcoming Deadlines */}
        <Card
          hover
          onClick={() => setCurrentView('schedule')}
          className="p-4"
        >
          <div className="text-slate-500 text-xs mb-1.5">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">
              Next Gate
            </span>
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-900 truncate">
            {project.milestones?.[0]?.dueDate || project.targetDate || 'TBD'}
          </div>
          <p className="text-[11px] text-purple-700 font-medium mt-1 truncate">
            {project.milestones?.[0]?.title || 'No Milestones Set'}
          </p>
        </Card>
      </div>

      {/* PROMINENT PROJECT HEALTH & VARIANCE ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prominent Project Health Card */}
        <Card className="p-5 lg:col-span-2 bg-gradient-to-br from-white via-white to-slate-50 border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-3 mt-1">
                <h3 className="text-xl font-bold text-slate-900">
                  PROJECT:
                </h3>
                <Badge variant="success" size="lg">
                  {project.health.overall}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-slate-500">
              Last Evaluated: <strong className="text-slate-800">Live</strong>
            </div>
          </div>

          {/* 4 Health Dimension Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            {/* Schedule */}
            <div
              onClick={() => setCurrentView('schedule')}
              className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 cursor-pointer hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                <span>Schedule</span>
                <Clock className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="text-base font-bold text-amber-800">
                {project.health.schedule}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                +{project.scheduleVarianceDays} Days Variance
              </p>
            </div>

            {/* Budget */}
            <div
              onClick={() => setCurrentView('budget')}
              className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 cursor-pointer hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between text-xs text-amber-800 font-semibold mb-1">
                <span>Budget</span>
                <DollarSign className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <div className="text-base font-bold text-amber-800">
                {project.health.budget}
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                +{project.budgetVariancePercent}% Burn Variance
              </p>
            </div>

            {/* Quality */}
            <div
              onClick={() => setCurrentView('quality')}
              className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 cursor-pointer hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between text-xs text-emerald-800 font-semibold mb-1">
                <span>Quality</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <div className="text-base font-bold text-emerald-800">
                {project.health.quality}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                {project.qualityMetrics.testsPassedPercent}% Test Pass Rate
              </p>
            </div>

            {/* Resources */}
            <div
              onClick={() => setCurrentView('team')}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:shadow-xs transition-all"
            >
              <div className="flex items-center justify-between text-xs text-slate-700 font-semibold mb-1">
                <span>Resources</span>
                <Users className="h-3.5 w-3.5 text-slate-500" />
              </div>
              <div className="text-base font-bold text-slate-800">
                {project.health.resources}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {teamMembers.length} team members allocated
              </p>
            </div>
          </div>

          {/* Task Breakdown Distribution Bar */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Sprint Workload Distribution</span>
              <span className="text-slate-500 text-[11px]">
                {totalTasks} total tasks tracked
              </span>
            </div>

            {/* Multi-segment Bar */}
            <div className="h-3 rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/50">
              <div
                title={`Done: ${completedTasks}`}
                style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                className="bg-emerald-500 h-full transition-all"
              />
              <div
                title={`In Review: ${reviewTasks}`}
                style={{ width: `${(reviewTasks / totalTasks) * 100}%` }}
                className="bg-sky-500 h-full transition-all"
              />
              <div
                title={`In Progress: ${inProgressTasks}`}
                style={{ width: `${(inProgressTasks / totalTasks) * 100}%` }}
                className="bg-amber-500 h-full transition-all"
              />
              <div
                title={`To Do: ${todoTasks}`}
                style={{ width: `${(todoTasks / totalTasks) * 100}%` }}
                className="bg-slate-300 h-full transition-all"
              />
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Done ({completedTasks})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                In Review ({reviewTasks})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                In Progress ({inProgressTasks})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                To Do ({todoTasks})
              </span>
            </div>
          </div>
        </Card>

        {/* ISSUES & VARIANCE PANEL */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Variance & Risk Radar
              </h3>
              <Badge variant="warning" size="sm">
                Variance Active
              </Badge>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Schedule Variance</span>
                <span className="font-bold text-amber-700">
                  +{project.scheduleVarianceDays} Days Behind
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Budget Variance</span>
                <span className="font-bold text-amber-700">
                  +{project.budgetVariancePercent}% {project.spentBudget > project.totalBudget ? `($${(project.spentBudget - project.totalBudget).toLocaleString()} over)` : ''}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">Scope Changes</span>
                <span className="font-bold text-sky-700">
                  {changeRequests.filter((c) => c.status === 'Pending Approval').length} Pending CRs
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50">
                <span className="text-slate-600 font-medium">QA Conformance</span>
                <span className="font-bold text-emerald-700">
                  {project.qualityMetrics.testsPassedPercent}% Passed
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setCurrentView('final-report')}
              className="w-full py-2 px-3 text-xs font-semibold text-neutral-800 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Inspect Full Variance Analysis</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </Card>
      </div>

      {/* QUICK KANBAN BOARD PREVIEW */}
      <Card>
        <CardHeader
          title="Interactive Board"
          icon={<Kanban className="h-4 w-4 text-sky-600" />}
          action={
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('kanban')}
                className="text-xs font-semibold text-neutral-400 hover:underline hover:underline-sky-600 hover:text-sky-600 flex items-center gap-1 hover:cursor-pointer"
              >
                <span className="text-sky-800">Full Board View</span>
                <ChevronRight className="h-3.5 w-3.5 text-sky-600" />
              </button>
            </div>
          }
        />
        <div className="p-4 sm:p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Columns: To Do, In Progress, In Review, Done */}
            {[
              { id: 'todo', label: 'To Do', color: 'border-slate-300' },
              { id: 'in_progress', label: 'In Progress', color: 'border-amber-400' },
              { id: 'in_review', label: 'In Review', color: 'border-sky-400' },
              { id: 'done', label: 'Done', color: 'border-emerald-500' },
            ].map((col) => {
              const colTasks = kanbanTasks.filter(
                (t) => t.column === col.id
              );

              return (
                <div
                  key={col.id}
                  className="bg-slate-50/70 rounded-xl p-3 border border-slate-200/70 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-xs">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      {col.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] font-bold text-slate-600">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {colTasks.length === 0 ? (
                      <p className="text-[11px] text-slate-400 py-4 text-center">
                        No tasks in this stage
                      </p>
                    ) : (
                      colTasks.slice(0, 3).map((task) => {
                        const assignee = getAssignee(task.assigneeId);

                        return (
                          <div
                            key={task.id}
                            className="p-3 bg-white rounded-lg border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all space-y-2"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <Badge
                                variant={
                                  task.priority === 'Urgent' || task.priority === 'High'
                                    ? 'danger'
                                    : task.priority === 'Medium'
                                      ? 'warning'
                                      : 'neutral'
                                }
                                size="sm"
                              >
                                {task.priority}
                              </Badge>

                              {/* Quick Move Selector */}
                              <select
                                value={task.column}
                                onChange={(e) =>
                                  moveKanbanTask(task.id, e.target.value as KanbanTask['column'])
                                }
                                className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-600 cursor-pointer"
                              >
                                <option value="todo">To Do</option>
                                <option value="in_progress">In Prog</option>
                                <option value="in_review">Review</option>
                                <option value="done">Done</option>
                              </select>
                            </div>

                            <h4 className="text-xs font-semibold text-slate-800 leading-snug">
                              {task.title}
                            </h4>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                              <span className="flex items-center gap-1 font-mono">
                                <Clock className="h-3 w-3" />
                                {task.dueDate}
                              </span>

                              <div className="flex items-center gap-1.5">
                                <div
                                  title={`${assignee.name} (${assignee.role})`}
                                  className="h-5 w-5 rounded-full bg-slate-100 border border-slate-300 text-slate-700 font-bold text-[9px] flex items-center justify-center font-mono"
                                >
                                  {assignee.initials || assignee.name.slice(0, 2).toUpperCase()}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* UPCOMING DEADLINES & KEY MILESTONES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deadlines list */}
        <Card>
          <CardHeader
            title="Next Upcoming Critical Deadlines"
            subtitle="Time-sensitive sprint gates and deliverable handovers."
            icon={<Clock className="h-4 w-4 text-purple-600" />}
          />
          <CardContent className="divide-y divide-slate-100 p-0">
            {project.milestones && project.milestones.length > 0 ? (
              project.milestones.map((milestone) => (
                <div key={milestone.id} className="p-4 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors">
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                      {milestone.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Due: {milestone.dueDate || 'TBD'}</span>
                      <span>•</span>
                      <span>Lead: {milestone.owner || 'Unassigned'}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      milestone.status === 'Completed'
                        ? 'success'
                        : milestone.status === 'In Progress'
                          ? 'warning'
                          : 'purple'
                    }
                    size="sm"
                  >
                    {milestone.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                No upcoming deadlines or milestones logged for this project.
              </div>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
