'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  CheckSquare2,
  CheckCircle2,
  Bug,
  ShieldCheck,
  Plus,
  Flame,
  Check,
  FolderGit2,
} from 'lucide-react';
import { IssueItem } from '@/types/project';

export function QualityView() {
  const {
    project,
    toggleQualityCheck,
    updateIssueStatus,
    addIssue,
  } = useProject();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend / UI');
  const [priority, setPriority] = useState<IssueItem['priority']>('High');
  const [assignedTo, setAssignedTo] = useState(project.teamMembers[0]?.name || 'Project Manager');
  const [dueDate, setDueDate] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addIssue({
      title: title.trim(),
      category,
      priority,
      assignedTo,
      dueDate,
      status: 'Open',
    });

    setTitle('');
    setIsFormOpen(false);
  };

  const passedChecksCount = project.qualityChecklist.filter((c) => c.passed).length;
  const totalChecksCount = project.qualityChecklist.length || 1;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
          <span>/</span>
          <span className="text-emerald-700 font-semibold">Quality & QA Control</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Quality Assurance & Defect Management</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                {project.code}
              </span>
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Quality gates, accessibility conformance, automated test coverage, and defect remediation lifecycle.
            </p> */}
          </div>
          {isFormOpen ? (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="quality-form"
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Report Quality Issue / Bug
            </button>
          )}
        </div>
      </div>

      {/* TOP QUALITY METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Tests Run</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {project.qualityMetrics.testsCompleted} / {project.qualityMetrics.totalTests}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Automated suites</p>
        </Card>

        <Card className="p-4 border-emerald-200 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-1">
            <span className="font-semibold">Tests Passed</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {project.qualityMetrics.testsPassedPercent}%
          </div>
          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Zero regression</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">QA Completion</span>
            <CheckSquare2 className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {project.qualityMetrics.qaCompletionPercent}%
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Verification gates</p>
        </Card>

        <Card className="p-4 border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
            <span className="font-semibold">Open Defects</span>
            <Bug className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800">
            {project.qualityMetrics.openBugs}
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Active triage</p>
        </Card>

        <Card className="p-4 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span className="font-semibold">Critical Blockers</span>
            <Flame className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            {project.qualityMetrics.criticalBugs}
          </div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Urgent blockers</p>
        </Card>
      </div>

      {/* DEDICATED SECTION: REPORT QUALITY ISSUE / BUG */}
      {isFormOpen && (
        <Card className="p-5 border-emerald-200/80 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Report Quality Issue / Bug
                </h2>
                <p className="text-xs text-slate-500">
                  Log a software bug, regression defect, or verification anomaly for {project.name}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5 text-emerald-600" />
              Project: {project.code}
            </span>
          </div>

          <form id="quality-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Defect Summary / Title *
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Frontend / UI">Frontend / UI</option>
                  <option value="Backend / API">Backend / API</option>
                  <option value="Database">Database</option>
                  <option value="Security / Auth">Security / Auth</option>
                  <option value="Performance">Performance</option>
                  <option value="Accessibility">Accessibility</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Severity / Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as IssueItem['priority'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Assignee (Designation)
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  {project.teamMembers && project.teamMembers.length > 0 ? (
                    project.teamMembers.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.role})
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                      <option value="Senior Backend Developer">Senior Backend Developer</option>
                      <option value="QA & Compliance Lead">QA & Compliance Lead</option>
                      <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                      <option value="DevOps & Reliability Engineer">DevOps & Reliability Engineer</option>
                      <option value="Project Manager">Project Manager</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Remediation Due Date
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-3.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* QUALITY CHECKLIST & VERIFICATION GATES */}
      <Card>
        <CardHeader
          title="Quality Control & Verification Checklist"
          // subtitle="Mandatory gate criteria for release candidate acceptance testing."
          icon={<CheckSquare2 className="h-4 w-4 text-emerald-600" />}
          action={
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">
                {passedChecksCount} of {totalChecksCount} passed
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono">
                {Math.round((passedChecksCount / totalChecksCount) * 100)}%
              </span>
            </div>
          }
        />
        <div className="divide-y divide-slate-100">
          {project.qualityChecklist.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleQualityCheck(item.id)}
              className="p-4 flex items-center justify-between hover:bg-slate-50/70 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-colors ${item.passed
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                    }`}
                >
                  {item.passed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <div>
                  <p
                    className={`text-xs font-medium transition-colors ${item.passed ? 'text-slate-800' : 'text-slate-600'
                      }`}
                  >
                    {item.item}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Category: {item.category} • Inspector: {item.inspector}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                  Verified {item.lastChecked}
                </span>
                <Badge variant={item.passed ? 'success' : 'neutral'} size="sm">
                  {item.passed ? 'Passed' : 'Pending Verification'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ACTIVE BUGS & DEFECTS TABLE */}
      <Card>
        <CardHeader
          title="Active Project Defects & Issue Register"
          // subtitle="Tracked anomalies, priority triage, assignments, and resolution status."
          icon={<Bug className="h-4 w-4 text-rose-500" />}
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="py-3 px-4">Defect ID & Summary</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Assigned To</th>
                <th className="py-3 px-3">Due Date</th>
                <th className="py-3 px-4">Status Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.issues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Zero open bugs recorded for this project!
                  </td>
                </tr>
              ) : (
                project.issues.map((issue) => {
                  const isCrit = issue.priority === 'Critical';
                  const isResolved = issue.status === 'Resolved';

                  return (
                    <tr
                      key={issue.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isResolved ? 'opacity-60 bg-slate-50/30' : ''
                        }`}
                    >
                      <td className="py-3.5 px-4 max-w-sm">
                        <span className="font-mono text-[11px] text-slate-400 font-semibold">
                          {issue.code}
                        </span>
                        <p className={`font-semibold text-slate-900 mt-0.5 text-xs ${isResolved ? 'line-through text-slate-500' : ''}`}>
                          {issue.title}
                        </p>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="font-medium text-slate-700">{issue.category}</span>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <Badge
                          variant={
                            isCrit
                              ? 'danger'
                              : issue.priority === 'High'
                                ? 'warning'
                                : 'neutral'
                          }
                          size="sm"
                          dot={isCrit}
                        >
                          {issue.priority}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap font-medium text-slate-800">
                        {issue.assignedTo}
                      </td>

                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-500">
                        {issue.dueDate}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={issue.status}
                          onChange={(e) =>
                            updateIssueStatus(issue.id, e.target.value as IssueItem['status'])
                          }
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer ${issue.status === 'Open'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : issue.status === 'In Progress'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
