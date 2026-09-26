'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  PieChart,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Plus,
  Check,
  FolderGit2,
  Sliders,
} from 'lucide-react';
import { TeamMember } from '@/types/project';

export function BudgetView() {
  const { project, setCurrentView, addBudgetCategory, updateResourceAllocation } = useProject();

  const spentPercent = Math.round((project.spentBudget / (project.totalBudget || 1)) * 100);

  // Form toggle
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'budget' | 'resource'>('budget');

  // New Budget Category Form
  const [categoryName, setCategoryName] = useState('');
  const [allocated, setAllocated] = useState<number>(0);
  const [spent, setSpent] = useState<number>(0);
  const [color, setColor] = useState('#10b981');

  // Resource Allocation Form
  const [selectedMemberId, setSelectedMemberId] = useState<string>(
    project.teamMembers[0]?.id || ''
  );
  const [memberAllocation, setMemberAllocation] = useState<number>(85);
  const [workloadStatus, setWorkloadStatus] = useState<TeamMember['workloadStatus']>('Optimal');

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    addBudgetCategory({
      category: categoryName.trim(),
      allocated: Number(allocated) || 0,
      spent: Number(spent) || 0,
      color,
    });

    setCategoryName('');
    setIsFormOpen(false);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    updateResourceAllocation(selectedMemberId, Number(memberAllocation), workloadStatus);
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
          <span className="text-emerald-700 font-semibold">Budget & Resources</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Cost, Budget & Resource Allocation</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                {project.code}
              </span>
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Financial performance, category expenditure pacing, resource capacity, and workload balance across project teams.
            </p> */}
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
                  form={activeTab === 'budget' ? 'budget-form' : 'resource-form'}
                  className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsFormOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Cost / Allocation
              </button>
            )}
            <button
              onClick={() => setCurrentView('changes')}
              className="px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors"
            >
              Change Requests
            </button>
          </div>
        </div>
      </div>

      {/* TOP KPI BUDGET CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Budget */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Total Authorized Budget
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            ${project.totalBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Baseline allocation cap
          </p>
        </Card>

        {/* Spent */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Actual Cost (AC) Spent
            </span>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">
            ${project.spentBudget.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-amber-700 font-medium">
            <span>{spentPercent}% of total funds</span>
          </div>
        </Card>

        {/* Remaining */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Remaining Contingency
            </span>
            <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">
            ${project.remainingBudget.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Available unallocated buffer
          </p>
        </Card>

        {/* Budget Variance */}
        <Card className="p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Cost Variance
            </span>
            <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-800">
            {project.budgetVariancePercent > 0 ? `+${project.budgetVariancePercent}%` : `${project.budgetVariancePercent}%`}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Against initial forecast
          </p>
        </Card>
      </div>

      {/* DEDICATED SECTION: ADD COST, BUDGET & RESOURCE ALLOCATION */}
      {isFormOpen && (
        <Card className="p-5 border-emerald-200/80 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Add Cost, Budget & Resource Allocation
                </h2>
                <p className="text-xs text-slate-500">
                  Manage financial expense lines and specialist workload allocations for {project.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('budget')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'budget'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                + Add Budget Item
              </button>
              <button
                onClick={() => setActiveTab('resource')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'resource'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                Adjust Resource Workload
              </button>
            </div>
          </div>

          {activeTab === 'budget' ? (
            <form id="budget-form" onSubmit={handleBudgetSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cost / Budget Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Allocated Amount ($ USD) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={allocated}
                    onChange={(e) => setAllocated(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Spent to Date ($ USD)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={spent}
                    onChange={(e) => setSpent(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Tag Color:</span>
                  {['#10b981', '#0284c7', '#f59e0b', '#8b5cf6', '#ec4899'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`h-5 w-5 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-slate-900' : 'border-transparent'
                        }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
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
              </div>
            </form>
          ) : (
            <form id="resource-form" onSubmit={handleResourceSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Team Member *
                  </label>
                  <select
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    {project.teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role}) - Current: {m.allocation}%
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Capacity Allocation (%): {memberAllocation}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={memberAllocation}
                    onChange={(e) => setMemberAllocation(Number(e.target.value))}
                    className="w-full accent-emerald-600 mt-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Workload Status
                  </label>
                  <select
                    value={workloadStatus}
                    onChange={(e) => setWorkloadStatus(e.target.value as TeamMember['workloadStatus'])}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                  >
                    <option value="Optimal">Optimal (Normal)</option>
                    <option value="High">High (Near Limit)</option>
                    <option value="Overallocated">Overallocated (&gt;100%)</option>
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
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* DETAILED CATEGORY BUDGET BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Project Budget Allocation by Category"
            subtitle="Real-time variance tracking between baseline budget and actual spent capital."
            icon={<Briefcase className="h-4 w-4 text-emerald-600" />}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold select-none">
                  <th className="py-3 px-4">Cost Category</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Spent</th>
                  <th className="py-3 px-4">Remaining</th>
                  <th className="py-3 px-4">Pacing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {project.budgetBreakdown.map((item) => {
                  const remaining = item.allocated - item.spent;
                  const itemPercent = Math.round((item.spent / (item.allocated || 1)) * 100);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-800">
                            {item.category}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        ${item.allocated.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                        ${item.spent.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        ${remaining.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <ProgressBar
                            value={itemPercent}
                            color={itemPercent > 90 ? 'rose' : itemPercent > 70 ? 'amber' : 'emerald'}
                            size="xs"
                            showPercent={false}
                          />
                          <span className="font-mono text-[11px] text-slate-500 w-8">
                            {itemPercent}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* FINANCIAL HEALTH SIDEBAR */}
        <Card className="p-5 flex flex-col justify-between">
          <CardHeader
            title="Earned Value Analysis"
            subtitle="EVM efficiency ratios"
            icon={<PieChart className="h-4 w-4 text-emerald-600" />}
          />
          <CardContent className="space-y-4 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Burn Rate (Per Sprint)</span>
              <span className="font-bold text-slate-900 font-mono">$4,200</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Scheduled Sprints Complete</span>
                <span className="font-bold text-slate-800">4 of 6</span>
              </div>
              <ProgressBar value={67} color="emerald" size="sm" showPercent={false} />
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Cost Variance (CV)</span>
                <span className="font-bold text-rose-600 font-mono">-$1,300</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Schedule Variance (SV)</span>
                <span className="font-bold text-amber-800 font-mono">+5 Days</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-semibold text-emerald-900">CPI (Cost Performance Index)</span>
                <span className="font-bold text-slate-800">0.92</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-bold text-slate-800">Financial Insights:</p>
              <ul className="list-disc pl-4 space-y-1.5 text-slate-500">
                <li>
                  Labor constitutes the majority of expenditure pacing.
                </li>
                <li>
                  Active change requests dynamically recalculate project contingency buffers.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RESOURCE ALLOCATION & WORKLOADS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Team Workload & Capacity Allocation
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {project.teamMembers.length} Dedicated Core Specialists
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.teamMembers.map((member) => {
            const isHigh = member.workloadStatus === 'High';
            const isOver = member.allocation >= 100;

            return (
              <Card
                key={member.id}
                className={`p-4 transition-all ${isOver ? 'border-amber-300 shadow-xs' : 'border-slate-200'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center font-mono">
                      {member.initials || member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${isOver ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {member.name}
                      </h4>
                      <Badge
                        variant={isOver ? 'warning' : 'success'}
                        size="sm"
                      >
                        {member.workloadStatus}
                      </Badge>
                    </div>
                    {member.role !== member.name && (
                      <p className="text-xs text-slate-500">{member.role}</p>
                    )}
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      {member.department}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Capacity Allocation</span>
                    <span className={`font-bold ${isOver ? 'text-amber-700' : 'text-slate-800'}`}>
                      {member.allocation}%
                    </span>
                  </div>
                  <ProgressBar
                    value={member.allocation}
                    color={isOver ? 'amber' : 'emerald'}
                    size="xs"
                    showPercent={false}
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      Active Tasks: <strong className="text-slate-800">{member.activeTasks}</strong>
                    </span>
                    <span>
                      Completed: <strong className="text-slate-800">{member.completedTasks}</strong>
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
