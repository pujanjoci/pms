'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { ProjectData } from '@/types/project';
import { X, FolderPlus, Calendar, User, FileText } from 'lucide-react';

export function CreateProjectModal() {
  const { activeModal, closeModal, addProject, authUser } = useProject();

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    projectManager: '',
    projectSponsor: '',
    startDate: '',
    targetDate: '',
    status: 'On Track' as ProjectData['status'],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (activeModal !== 'create-project') return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Project name is required';
    if (!form.code.trim()) errs.code = 'Project code is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.targetDate) errs.targetDate = 'Target date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const id = `proj-${Date.now()}`;
    const newProject: ProjectData = {
      id,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      status: form.status,
      health: {
        overall: 'On Track',
        schedule: 'On Track',
        budget: 'Healthy',
        quality: 'Healthy',
        resources: 'On Track',
      },
      projectManager: form.projectManager.trim() || authUser?.name || 'Project Manager',
      projectSponsor: form.projectSponsor.trim() || 'Project Sponsor',
      startDate: form.startDate,
      targetDate: form.targetDate,
      progress: 0,
      totalBudget: 0,
      spentBudget: 0,
      remainingBudget: 0,
      budgetVariancePercent: 0,
      scheduleVarianceDays: 0,
      description: form.description.trim(),
      businessNeed: '',
      projectPurpose: '',
      developmentApproach: '',
      objectives: [],
      scope: { inScope: [], outOfScope: [] },
      schedulePhases: [],
      milestones: [],
      dependencies: [],
      budgetBreakdown: [],
      teamMembers: [],
      risks: [],
      stakeholders: [],
      communicationPlan: [],
      qualityChecklist: [],
      qualityMetrics: {
        testsCompleted: 0,
        totalTests: 0,
        testsPassedPercent: 0,
        openBugs: 0,
        criticalBugs: 0,
        qaCompletionPercent: 0,
      },
      issues: [],
      changeRequests: [],
      raciMatrix: [],
      kanbanTasks: [],
      insights: [],
      keyFindings: [],
      recommendations: [],
    };

    addProject(newProject);
    setForm({
      name: '', code: '', description: '', projectManager: '',
      projectSponsor: '', startDate: '', targetDate: '', status: 'On Track',
    });
    setErrors({});
  };

  const field = (
    label: string,
    key: keyof typeof form,
    type = 'text',
    required = false,
  ) => (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className={`w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all ${
          errors[key] ? 'border-rose-400' : 'border-slate-200'
        }`}
      />
      {errors[key] && (
        <p className="text-[10px] text-rose-500 mt-0.5">{errors[key]}</p>
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center">
              <FolderPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Create New Project</h2>
              <p className="text-[11px] text-slate-500">Set up your project workspace</p>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Basic Info */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <FileText className="h-3.5 w-3.5" />
            Basic Information
          </div>

          {field('Project Name', 'name', 'text', true)}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.code}
                onChange={(e) =>
                  setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))
                }
                placeholder="e.g. PRJ-001"
                className={`w-full px-3 py-2 text-xs border rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500 transition-all font-mono ${
                  errors.code ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              {errors.code && (
                <p className="text-[10px] text-rose-500 mt-0.5">{errors.code}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: e.target.value as ProjectData['status'] }))
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500 transition-all"
              >
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Delayed">Delayed</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-500/30 focus:border-neutral-500 transition-all resize-none"
            />
          </div>

          {/* People */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">
            <User className="h-3.5 w-3.5" />
            Leadership
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field('Project Manager', 'projectManager')}
            {field('Project Sponsor', 'projectSponsor')}
          </div>

          {/* Dates */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">
            <Calendar className="h-3.5 w-3.5" />
            Timeline
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {field('Start Date', 'startDate', 'date', true)}
            {field('Target End Date', 'targetDate', 'date', true)}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-sm transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
