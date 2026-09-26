'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  CalendarDays,
  Flag,
  ArrowRight,
  Clock,
  AlertCircle,
  GitBranch,
  Plus,
  Check,
  FolderGit2,
} from 'lucide-react';
import { SchedulePhase, Milestone } from '@/types/project';

export function ScheduleView() {
  const { project, setCurrentView, addSchedulePhase, addMilestone } = useProject();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'phase' | 'milestone'>('phase');

  // Phase Form State
  const [phaseName, setPhaseName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [lead, setLead] = useState(project.teamMembers[0]?.name || 'Project Manager');
  const [durationWeeks, setDurationWeeks] = useState(3);
  const [phaseStatus, setPhaseStatus] = useState<SchedulePhase['status']>('Upcoming');

  // Milestone Form State
  const [msTitle, setMsTitle] = useState('');
  const [msDueDate, setMsDueDate] = useState('');
  const [msOwner, setMsOwner] = useState(project.teamMembers[0]?.name || 'Project Manager');
  const [msDescription, setMsDescription] = useState('');
  const [msStatus, setMsStatus] = useState<Milestone['status']>('Pending');

  const handlePhaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phaseName.trim()) return;

    addSchedulePhase({
      name: phaseName.trim(),
      startDate,
      endDate,
      lead,
      durationWeeks: Number(durationWeeks) || 2,
      progress: phaseStatus === 'Completed' ? 100 : phaseStatus === 'In Progress' ? 50 : 0,
      status: phaseStatus,
    });

    setPhaseName('');
    setIsFormOpen(false);
  };

  const handleMilestoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msTitle.trim()) return;

    addMilestone({
      title: msTitle.trim(),
      dueDate: msDueDate,
      owner: msOwner,
      description: msDescription.trim() || 'Key deliverable milestone gate for project governance.',
      status: msStatus,
      completionDate: msStatus === 'Completed' ? 'Today' : undefined,
    });

    setMsTitle('');
    setMsDescription('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Schedule & Timeline</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Schedule, Timeline & Milestones</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                {project.code}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Gantt timeline visualization, milestone gate reviews, critical path dependencies, and schedule variance tracking.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isFormOpen ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form={formMode === 'phase' ? 'phase-form' : 'milestone-form'}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Phase / Milestone
              </button>
            )}
            <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-800 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-amber-600" />
              Variance: +{project.scheduleVarianceDays}d Lag
            </div>
          </div>
        </div>
      </div>

      {/* DEDICATED SECTION: ADD SCHEDULE PHASE & MILESTONES */}
      {isFormOpen && (
        <Card className="p-5 border-neutral-200 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Add Schedule Phase & Milestones
                </h2>
                <p className="text-xs text-slate-500">
                  Plan timeline sprints or formal completion milestones for {project.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFormMode('phase')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  formMode === 'phase'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                + Add Schedule Phase
              </button>
              <button
                onClick={() => setFormMode('milestone')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  formMode === 'milestone'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                + Add Milestone Gate
              </button>
            </div>
          </div>

          {formMode === 'phase' ? (
            <form id="phase-form" onSubmit={handlePhaseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phase Name *
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={phaseName}
                    onChange={(e) => setPhaseName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Timeline (Start – End)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder=""
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    />
                    <input
                      type="text"
                      placeholder=""
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duration (Weeks)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phase Lead (Designation)
                  </label>
                  <select
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white"
                  >
                    {project.teamMembers && project.teamMembers.length > 0 ? (
                      project.teamMembers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                        <option value="Senior Backend Developer">Senior Backend Developer</option>
                        <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                        <option value="QA & Compliance Lead">QA & Compliance Lead</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phase Status
                  </label>
                  <select
                    value={phaseStatus}
                    onChange={(e) => setPhaseStatus(e.target.value as SchedulePhase['status'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white"
                  >
                    <option value="Upcoming">Upcoming (Scheduled)</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <form id="milestone-form" onSubmit={handleMilestoneSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Milestone Gate Title *
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={msTitle}
                    onChange={(e) => setMsTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={msDueDate}
                    onChange={(e) => setMsDueDate(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Owner (Designation)
                  </label>
                  <select
                    value={msOwner}
                    onChange={(e) => setMsOwner(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white"
                  >
                    {project.teamMembers && project.teamMembers.length > 0 ? (
                      project.teamMembers.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name} ({m.role})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                        <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                        <option value="QA & Compliance Lead">QA & Compliance Lead</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status
                  </label>
                  <select
                    value={msStatus}
                    onChange={(e) => setMsStatus(e.target.value as Milestone['status'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deliverable Description / Gate Acceptance Criteria
                </label>
                <textarea
                  rows={2}
                  placeholder=""
                  value={msDescription}
                  onChange={(e) => setMsDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* GANTT TIMELINE VISUALIZATION */}
      <Card>
        <CardHeader
          title="Project Lifecycle Timeline & Phase Progress"
          subtitle={`${project.startDate} — ${project.targetDate}`}
          icon={<CalendarDays className="h-4 w-4 text-neutral-800" />}
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Status:</span>
              <Badge variant={project.status === 'On Track' ? 'success' : 'warning'} dot>
                {project.status}
              </Badge>
            </div>
          }
        />
        <CardContent className="space-y-6">
          {/* Phase Bars */}
          <div className="space-y-5">
            {project.schedulePhases.map((phase, idx) => {
              const statusVariant =
                phase.status === 'Completed'
                  ? 'success'
                  : phase.status === 'In Progress'
                  ? 'warning'
                  : 'neutral';

              return (
                <div key={phase.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-400 font-semibold">
                        0{idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 text-sm">
                        {phase.name}
                      </span>
                      <Badge variant={statusVariant} size="sm" dot>
                        {phase.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500">
                      <span>Lead: <strong className="text-slate-700">{phase.lead}</strong></span>
                      <span>•</span>
                      <span className="font-mono font-medium">{phase.startDate} – {phase.endDate}</span>
                      <span>•</span>
                      <span className="font-bold text-slate-900">{phase.progress}%</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        phase.status === 'Completed'
                          ? 'bg-neutral-900'
                          : phase.status === 'In Progress'
                          ? 'bg-amber-500'
                          : 'bg-slate-300'
                      }`}
                      style={{ width: `${Math.max(phase.progress, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* MILESTONE GATES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flag className="h-4 w-4 text-neutral-800" />
            <h3 className="text-base font-bold text-slate-900">
              Key Milestone Review Gates
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {project.milestones.filter((m) => m.status === 'Completed').length} of{' '}
            {project.milestones.length} Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.milestones.map((ms) => {
            const isDone = ms.status === 'Completed';
            const isProg = ms.status === 'In Progress';

            return (
              <Card
                key={ms.id}
                className={`p-4 transition-all ${
                  isDone
                    ? 'border-neutral-300 bg-neutral-50/50'
                    : isProg
                    ? 'border-amber-200 bg-amber-50/20'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded font-semibold ${
                        isDone
                          ? 'bg-neutral-100 text-neutral-900'
                          : isProg
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ms.dueDate}
                    </span>
                    <Badge
                      variant={isDone ? 'success' : isProg ? 'warning' : 'neutral'}
                      size="sm"
                    >
                      {ms.status}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                      {ms.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {ms.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500">
                    <span>Owner: <strong className="text-slate-700">{ms.owner}</strong></span>
                    {ms.completionDate && (
                      <span className="text-[11px] text-neutral-700 font-medium">
                        Done: {ms.completionDate}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* TASK DEPENDENCIES (CRITICAL PATH) */}
      <Card>
        <CardHeader
          title="Critical Path & Task Dependencies"
          subtitle="End-to-end predecessor and successor chain governing launch milestone delivery."
          icon={<GitBranch className="h-4 w-4 text-neutral-800" />}
          action={
            <Badge variant="warning" size="sm">
              Critical Path Monitored
            </Badge>
          }
        />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {project.dependencies.map((dep, index) => {
              const isCrit = dep.status === 'Critical';
              const isResolved = dep.status === 'Resolved';

              return (
                <div
                  key={dep.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                    isCrit
                      ? 'bg-rose-50/60 border-rose-200 shadow-2xs'
                      : isResolved
                      ? 'bg-neutral-50/70 border-neutral-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-slate-400 font-semibold">
                        Step {index + 1}
                      </span>
                      <Badge
                        variant={
                          isResolved ? 'success' : isCrit ? 'danger' : 'neutral'
                        }
                        size="sm"
                      >
                        {dep.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">
                        {dep.from}
                      </p>
                      <div className="flex items-center justify-center py-1 text-slate-400">
                        <ArrowRight className="h-3.5 w-3.5 rotate-90 md:rotate-0" />
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-snug">
                        {dep.to}
                      </p>
                    </div>
                  </div>

                  {dep.delayDays && (
                    <div className="mt-3 pt-2 border-t border-rose-200/60 text-[10px] font-bold text-rose-700 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      Causes +{dep.delayDays}d Schedule Drag
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
