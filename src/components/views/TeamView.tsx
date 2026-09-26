'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  Users,
  Grid,
  Info,
  Plus,
  Check,
  Trash2,
  CheckCircle2,
  FolderGit2,
} from 'lucide-react';
import { RACIRole, RACIRow, TeamMember } from '@/types/project';

export function TeamView() {
  const {
    project,
    addTeamMember,
    deleteTeamMember,
    addRaciDeliverable,
    updateRaciCell,
    deleteRaciDeliverable,
  } = useProject();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'raci' | 'member'>('raci');

  // RACI Deliverable Form State
  const [deliverable, setDeliverable] = useState('');
  const [category, setCategory] = useState('Development');
  const [pmRole, setPmRole] = useState<RACIRole>('A');
  const [designerRole, setDesignerRole] = useState<RACIRole>('C');
  const [feRole, setFeRole] = useState<RACIRole>('R');
  const [beRole, setBeRole] = useState<RACIRole>('R');
  const [qaRole, setQaRole] = useState<RACIRole>('C');
  const [clientRole, setClientRole] = useState<RACIRole>('I');

  // Team Member Form State
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Senior Full-Stack Engineer');
  const [department, setDepartment] = useState('Engineering');
  const [allocation, setAllocation] = useState(80);

  const handleRaciSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverable.trim()) return;

    addRaciDeliverable({
      deliverable: deliverable.trim(),
      category: category.trim(),
      pm: pmRole,
      designer: designerRole,
      frontendDev: feRole,
      backendDev: beRole,
      qa: qaRole,
      client: clientRole,
    });

    setDeliverable('');
    setIsFormOpen(false);
  };

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    addTeamMember({
      name: memberName.trim(),
      role: memberRole.trim(),
      avatar: '',
      initials: memberName.slice(0, 2).toUpperCase(),
      allocation: Number(allocation) || 50,
      workloadStatus: allocation > 90 ? 'Overallocated' : allocation > 70 ? 'Optimal' : 'High',
      activeTasks: 3,
      completedTasks: 8,
      email: '',
      department: department.trim(),
    });

    setMemberName('');
    setIsFormOpen(false);
  };

  const cycleRole = (current: RACIRole): RACIRole => {
    switch (current) {
      case 'R':
        return 'A';
      case 'A':
        return 'C';
      case 'C':
        return 'I';
      case 'I':
        return '-';
      default:
        return 'R';
    }
  };

  const renderRaciBadge = (
    role: RACIRole,
    rowIndex: number,
    roleKey: keyof Omit<RACIRow, 'deliverable' | 'category'>
  ) => {
    const roleClasses = {
      R: 'bg-neutral-900 text-white',
      A: 'bg-sky-600 text-white',
      C: 'bg-amber-500 text-white',
      I: 'bg-slate-500 text-white',
      '-': 'bg-slate-100 text-slate-400 border border-slate-200',
    };

    return (
      <button
        type="button"
        onClick={() => updateRaciCell(rowIndex, roleKey, cycleRole(role))}
        title="Click to cycle role: R ➔ A ➔ C ➔ I ➔ -"
        className={`inline-flex items-center justify-center h-6 w-6 rounded-md font-bold text-xs shadow-2xs hover:scale-110 active:scale-95 transition-all cursor-pointer ${roleClasses[role] || 'bg-slate-200 text-slate-700'
          }`}
      >
        {role}
      </button>
    );
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
          <span className="text-neutral-900 font-semibold">Team & RACI</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Project Team & RACI Matrix</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                #{project.code} {project.name}
              </span>
            </h1>
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
                form={activeTab === 'raci' ? 'raci-form' : 'member-form'}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="h-3.5 w-3.5" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              Manage Team / RACI
            </button>
          )}
        </div>
      </div>

      {/* DEDICATED SECTION: ADD RACI DELIVERABLE OR TEAM MEMBER */}
      {isFormOpen && (
        <Card className="p-5 border-neutral-200 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Team & RACI Management
                </h2>
                <p className="text-xs text-slate-500">
                  Assign accountability roles or onboard team resources to {project.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('raci')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'raci'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                + Add RACI Deliverable
              </button>
              <button
                onClick={() => setActiveTab('member')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${activeTab === 'member'
                  ? 'bg-neutral-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                + Add Team Member
              </button>
            </div>
          </div>

          {activeTab === 'raci' ? (
            <form id="raci-form" onSubmit={handleRaciSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Deliverable / Work Package Name *
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={deliverable}
                    onChange={(e) => setDeliverable(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lifecycle Stage / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 bg-white"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Design">Design</option>
                    <option value="Development">Development</option>
                    <option value="QA / Testing">QA / Testing</option>
                    <option value="Governance">Governance</option>
                    <option value="Deployment">Deployment</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Assign RACI Roles for this Deliverable (R: Responsible, A: Accountable, C: Consulted, I: Informed)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                  {[
                    { label: 'Project Mgr', val: pmRole, set: setPmRole },
                    { label: 'UI Designer', val: designerRole, set: setDesignerRole },
                    { label: 'Frontend Dev', val: feRole, set: setFeRole },
                    { label: 'Backend Dev', val: beRole, set: setBeRole },
                    { label: 'QA Lead', val: qaRole, set: setQaRole },
                    { label: 'Client / Sponsor', val: clientRole, set: setClientRole },
                  ].map((col) => (
                    <div key={col.label} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                        {col.label}
                      </span>
                      <select
                        value={col.val}
                        onChange={(e) => col.set(e.target.value as RACIRole)}
                        className="w-full text-xs font-bold text-center border border-slate-300 rounded bg-white py-1"
                      >
                        <option value="R">R (Responsible)</option>
                        <option value="A">A (Accountable)</option>
                        <option value="C">C (Consulted)</option>
                        <option value="I">I (Informed)</option>
                        <option value="-">- (None)</option>
                      </select>
                    </div>
                  ))}
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
            <form id="member-form" onSubmit={handleMemberSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Designation / Title *
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={memberName}
                    onChange={(e) => setMemberName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Project Role
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder=""
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Capacity Allocation (%): {allocation}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={allocation}
                  onChange={(e) => setAllocation(Number(e.target.value))}
                  className="w-full accent-neutral-900 mt-2"
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

      {/* TEAM DIRECTORY CARDS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-neutral-800" />
            <h3 className="text-base font-bold text-slate-900">
              Project Team
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {project.teamMembers.length} Dedicated Core Specialists
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.teamMembers.map((member) => {
            const isHigh = member.workloadStatus === 'High';

            return (
              <Card key={member.id} className="p-4 relative group">
                <div className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center font-mono shadow-xs">
                      {member.initials || member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-white ${isHigh ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {member.name}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={
                            member.workloadStatus === 'Optimal'
                              ? 'success'
                              : member.workloadStatus === 'High'
                                ? 'warning'
                                : 'danger'
                          }
                          size="sm"
                        >
                          {member.workloadStatus}
                        </Badge>
                        <button
                          onClick={() => deleteTeamMember(member.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                          title="Remove team member"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {member.role !== member.name && (
                      <p className="text-xs text-slate-500">{member.role}</p>
                    )}
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {member.department}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Allocation</span>
                    <span className="font-bold text-slate-800">
                      {member.allocation}%
                    </span>
                  </div>
                  <ProgressBar
                    value={member.allocation}
                    color={isHigh ? 'amber' : 'neutral'}
                    size="xs"
                    showPercent={false}
                  />

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px] text-slate-500 truncate">
                      Dept: <strong className="text-slate-700">{member.department}</strong>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700 shrink-0">
                      {member.activeTasks} tasks active
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* RACI MATRIX */}
      <Card>
        <CardHeader
          title="Responsibility Assignment Matrix (R,A,C,I)"
          subtitle="Click on any RACI badge to cycle its role."
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold select-none">
              <tr>
                <th className="py-3 px-4">Deliverable / Work Package</th>
                <th className="py-3 px-3">Stage</th>
                <th className="py-3 px-3 text-center">Project Manager</th>
                <th className="py-3 px-3 text-center">Lead Designer</th>
                <th className="py-3 px-3 text-center">Frontend Dev</th>
                <th className="py-3 px-3 text-center">Backend Dev</th>
                <th className="py-3 px-3 text-center">QA Lead</th>
                <th className="py-3 px-3 text-center">Client Director</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.raciMatrix.map((row, index) => (
                <tr key={index} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="py-3.5 px-4 font-bold text-slate-900 text-xs">
                    {row.deliverable}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {row.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.pm, index, 'pm')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.designer, index, 'designer')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.frontendDev, index, 'frontendDev')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.backendDev, index, 'backendDev')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.qa, index, 'qa')}
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    {renderRaciBadge(row.client, index, 'client')}
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => deleteRaciDeliverable(index)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete Deliverable"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* RACI LEGEND */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 rounded-b-xl flex flex-wrap items-center gap-6 text-xs select-none">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            RACI Indicators:
          </span>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-neutral-900 text-white font-bold text-xs flex items-center justify-center">
              R
            </span>
            <span className="text-slate-600">
              <strong>Responsible</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
              A
            </span>
            <span className="text-slate-600">
              <strong>Accountable</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-amber-500 text-white font-bold text-xs flex items-center justify-center">
              C
            </span>
            <span className="text-slate-600">
              <strong>Consulted</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded bg-slate-500 text-white font-bold text-xs flex items-center justify-center">
              I
            </span>
            <span className="text-slate-600">
              <strong>Informed</strong>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
