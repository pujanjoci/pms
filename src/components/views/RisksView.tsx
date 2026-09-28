'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  AlertTriangle,
  Plus,
  Check,
  ShieldCheck,
  ShieldAlert,
  Layers,
  Clock,
  Trash2,
  FolderGit2,
} from 'lucide-react';
import { RiskItem } from '@/types/project';

export function RisksView() {
  const { project, addRisk, updateRiskStatus, deleteRisk } = useProject();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Inline Log Project Risk form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RiskItem['category']>('Technical');
  const [probability, setProbability] = useState<RiskItem['probability']>('Medium');
  const [impact, setImpact] = useState<RiskItem['impact']>('High');
  const [owner, setOwner] = useState(project.teamMembers[0]?.name || 'Project Manager');
  const [action, setAction] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !action.trim()) return;

    addRisk({
      title: title.trim(),
      category,
      probability,
      impact,
      riskScore:
        (probability === 'High' ? 6 : probability === 'Medium' ? 4 : 2) *
        (impact === 'High' ? 6 : impact === 'Medium' ? 4 : 2),
      owner,
      status: 'Open',
      action: action.trim(),
    });

    setTitle('');
    setAction('');
    setIsFormOpen(false);
  };

  // Filtered risks
  const filteredRisks = project.risks.filter((risk) => {
    if (categoryFilter !== 'All' && risk.category !== categoryFilter) return false;
    if (statusFilter !== 'All' && risk.status !== statusFilter) return false;
    return true;
  });

  // Risk Summary metrics
  const totalRisks = project.risks.length;
  const highRisks = project.risks.filter(
    (r) => r.impact === 'High' || r.riskScore >= 12
  ).length;
  const mediumRisks = project.risks.filter(
    (r) => r.impact === 'Medium' && r.riskScore < 12
  ).length;
  const lowRisks = project.risks.filter(
    (r) => r.impact === 'Low'
  ).length;
  const resolvedRisks = project.risks.filter(
    (r) => r.status === 'Mitigated' || r.status === 'Closed'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
          <span>/</span>
          <span className="text-emerald-700 font-semibold">Risk Register</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Risk Management & Mitigation Register</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                {project.code}
              </span>
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Active project threats, quantitative impact analysis, proactive mitigation actions, and audit trail.
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
                form="risk-form"
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
              Log Project Risk
            </button>
          )}
        </div>
      </div>

      {/* RISK SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Total Risks</span>
            <Layers className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalRisks}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Identified threats</p>
        </Card>

        <Card className="p-4 border-rose-200 bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-700 text-xs mb-1">
            <span className="font-semibold">High / Critical</span>
            <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-rose-700">{highRisks}</div>
          <p className="text-[11px] text-rose-600 font-medium mt-0.5">Needs daily review</p>
        </Card>

        <Card className="p-4 border-amber-200 bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-xs mb-1">
            <span className="font-semibold">Medium Risks</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{mediumRisks}</div>
          <p className="text-[11px] text-amber-700 font-medium mt-0.5">Under surveillance</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Low Risks</span>
            <Clock className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700">{lowRisks}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Accepted baseline</p>
        </Card>

        <Card className="p-4 border-emerald-200 bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-xs mb-1">
            <span className="font-semibold">Resolved</span>
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{resolvedRisks}</div>
          <p className="text-[11px] text-emerald-800 font-medium mt-0.5">Mitigated / Closed</p>
        </Card>
      </div>

      {/* DEDICATED SECTION: LOG PROJECT RISK */}
      {isFormOpen && (
        <Card className="p-5 border-emerald-200/80 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Log Project Risk
                </h2>
                <p className="text-xs text-slate-500">
                  Record an identified risk scoped directly to {project.name} ({project.code})
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-emerald-600" />
                Project: {project.code}
              </span>
            </div>
          </div>

          <form id="risk-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Risk Title / Vulnerability Description *
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
                  onChange={(e) => setCategory(e.target.value as RiskItem['category'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Technical">Technical</option>
                  <option value="Schedule">Schedule</option>
                  <option value="Budget">Budget</option>
                  <option value="Operational">Operational</option>
                  <option value="External">External</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Probability
                </label>
                <select
                  value={probability}
                  onChange={(e) => setProbability(e.target.value as RiskItem['probability'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Impact Severity
                </label>
                <select
                  value={impact}
                  onChange={(e) => setImpact(e.target.value as RiskItem['impact'])}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Owner (Designation)
                </label>
                <select
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
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
                      <option value="Project Manager">Project Manager</option>
                      <option value="Senior Frontend Developer">Senior Frontend Developer</option>
                      <option value="Senior Backend Developer">Senior Backend Developer</option>
                      <option value="Lead UI/UX Designer">Lead UI/UX Designer</option>
                      <option value="QA & Compliance Lead">QA & Compliance Lead</option>
                      <option value="DevOps & Reliability Engineer">DevOps & Reliability Engineer</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mitigation Strategy & Action Plan *
              </label>
              <textarea
                rows={2}
                placeholder=""
                value={action}
                onChange={(e) => setAction(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
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

      {/* RISK REGISTER DATA TABLE */}
      <Card>
        <CardHeader
          title="Risk Register Data Table"
          // subtitle="Comprehensive risk probability, severity rating, and assigned mitigation strategies."
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
          action={
            <div className="flex flex-wrap items-center gap-2">
              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Technical">Technical</option>
                <option value="Schedule">Schedule</option>
                <option value="Budget">Budget</option>
                <option value="Operational">Operational</option>
                <option value="External">External</option>
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Monitoring">Monitoring</option>
                <option value="Open">Open</option>
                <option value="Mitigated">Mitigated</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          }
        />

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold select-none">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Risk Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Probability</th>
                <th className="py-3 px-4">Impact</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Mitigation Strategy</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRisks.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    No project risks match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRisks.map((risk) => {
                  const score = risk.riskScore;
                  const isHighImpact = score >= 12;
                  const isMediumImpact = score >= 6 && score < 12;

                  return (
                    <tr
                      key={risk.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-700 whitespace-nowrap">
                        {risk.code}
                      </td>

                      {/* Title */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="font-semibold text-slate-800 leading-snug">
                          {risk.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Logged: {risk.dateLogged}
                        </p>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge variant="neutral" size="sm">
                          {risk.category}
                        </Badge>
                      </td>

                      {/* Probability */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${risk.probability === 'High'
                            ? 'text-rose-600'
                            : risk.probability === 'Medium'
                              ? 'text-amber-600'
                              : 'text-slate-600'
                            }`}
                        >
                          {risk.probability}
                        </span>
                      </td>

                      {/* Impact */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`font-semibold ${risk.impact === 'High'
                            ? 'text-rose-600'
                            : risk.impact === 'Medium'
                              ? 'text-amber-600'
                              : 'text-slate-600'
                            }`}
                        >
                          {risk.impact}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${isHighImpact
                            ? 'bg-rose-100 text-rose-800'
                            : isMediumImpact
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                            }`}
                        >
                          {score}
                        </span>
                      </td>

                      {/* Owner */}
                      <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                        {risk.owner}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={risk.status}
                          onChange={(e) =>
                            updateRiskStatus(risk.id, e.target.value as RiskItem['status'])
                          }
                          className={`text-xs font-semibold rounded-lg px-2 py-1 border transition-colors cursor-pointer ${risk.status === 'Monitoring'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : risk.status === 'Open'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : risk.status === 'Mitigated'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                          <option value="Monitoring">Monitoring</option>
                          <option value="Open">Open</option>
                          <option value="Mitigated">Mitigated</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 min-w-[200px]">
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {risk.action}
                        </p>
                      </td>

                      {/* Delete */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => deleteRisk(risk.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Risk"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
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
