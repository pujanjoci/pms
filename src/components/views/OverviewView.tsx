'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  FileText,
  Calendar,
  User,
  ShieldCheck,
  Target,
  CheckCircle2,
  Plus,
  Compass,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Clock,
  Check,
} from 'lucide-react';

export function OverviewView() {
  const { project, openModal, toggleObjective, setCurrentView } = useProject();

  const completedObjectives = project.objectives.filter((o) => o.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
          <span>/</span>
          <span className="text-emerald-700 font-semibold">Overview & Charter</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Project Overview & Charter
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              High-level strategic alignment, formal project charter, baseline objectives, and defined scope boundaries.
            </p> */}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => openModal('edit-scope')}
              className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Scope Item
            </button>
            <button
              onClick={() => setCurrentView('final-report')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Executive Summary
            </button>
          </div>
        </div>
      </div>

      {/* PROJECT HEADER CARD */}
      <Card className="bg-gradient-to-br from-white to-slate-50/50 border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {project.code}
                </span>
                <Badge variant="success" dot>
                  {project.status}
                </Badge>
                <Badge variant="purple" size="sm">
                  Active Sprint 4 / 6
                </Badge>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {project.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Overall Progress Gauge Card */}
            <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-xs lg:w-72 shrink-0">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-700">Project Progress</span>
                <span className="text-lg font-bold text-emerald-600">{project.progress}%</span>
              </div>
              <ProgressBar value={project.progress} color="emerald" size="md" showPercent={false} />
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
                <span>{project.kanbanTasks.filter((t) => t.column === 'done').length} tasks finished</span>
                <span>Target: {project.targetDate || 'TBD'}</span>
              </div>
            </div>
          </div>

          {/* Quick Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-5">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
                <User className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Project Manager
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {project.projectManager}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-sky-50 text-sky-600 shrink-0 border border-sky-100">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Project Sponsor
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {project.projectSponsor}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0 border border-purple-100">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Timeline
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  {project.startDate} – {project.targetDate}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0 border border-amber-100">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Schedule Variance
                </span>
                <span className="text-xs sm:text-sm font-semibold text-amber-700">
                  +{project.scheduleVarianceDays} Days (Lagging)
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* STRATEGIC OBJECTIVES */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Strategic Project Objectives ({completedObjectives}/{project.objectives.length} Achieved)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Click checkbox to toggle verification
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {project.objectives.map((obj) => (
            <div
              key={obj.id}
              onClick={() => toggleObjective(obj.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer select-none ${obj.completed
                ? 'bg-emerald-50/40 border-emerald-200/80 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {obj.completed ? (
                    <div className="h-5 w-5 rounded bg-emerald-600 text-white flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded border-2 border-slate-300 hover:border-emerald-500 flex items-center justify-center transition-colors" />
                  )}
                </div>
                <div className="space-y-1">
                  <h4
                    className={`text-xs sm:text-sm font-bold leading-snug ${obj.completed ? 'text-emerald-950 line-through' : 'text-slate-800'
                      }`}
                  >
                    {obj.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {obj.description}
                  </p>
                  <div className="pt-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      KPI: {obj.targetMetric}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PROJECT CHARTER */}
      <Card>
        <CardHeader
          title="Project Charter Blueprint"
          // subtitle="Foundational authorization document establishing business justification and operating parameters."
          icon={<FileText className="h-4 w-4" />}
        />
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
                Business Need
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.businessNeed}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Compass className="h-3.5 w-3.5 text-emerald-600" />
                Project Purpose
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {project.projectPurpose}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Layers className="h-3.5 w-3.5 text-emerald-600" />
              Development & Governance Approach
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {project.developmentApproach}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SCOPE: IN SCOPE VS OUT OF SCOPE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* In Scope */}
        <Card className="border-emerald-200/80">
          <CardHeader
            title="In-Scope Deliverables"
            subtitle="Authorized features, modules, and work packages included in contract baseline."
            action={
              <button
                onClick={() => openModal('edit-scope')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </button>
            }
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          />
          <CardContent className="divide-y divide-slate-100 p-0">
            {project.scope.inScope.map((item) => (
              <div key={item.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{item.title}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <Badge
                  variant={
                    item.status === 'Completed'
                      ? 'success'
                      : item.status === 'In Progress'
                        ? 'warning'
                        : 'neutral'
                  }
                  size="sm"
                  dot
                >
                  {item.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Out of Scope */}
        <Card className="border-slate-200">
          <CardHeader
            title="Out-of-Scope Boundaries"
            subtitle="Explicitly excluded work items preventing scope creep and unbudgeted effort."
            icon={<Info className="h-4 w-4 text-slate-500" />}
          />
          <CardContent className="divide-y divide-slate-100 p-0">
            {project.scope.outOfScope.map((item) => (
              <div key={item.id} className="p-4 space-y-1 hover:bg-slate-50/60 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800 line-through decoration-slate-400">
                    {item.title}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 uppercase bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded">
                    Excluded
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
