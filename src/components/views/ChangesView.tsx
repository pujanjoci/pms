'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Check,
  Calendar,
  DollarSign,
  AlertTriangle,
  FolderGit2,
} from 'lucide-react';

export function ChangesView() {
  const { project, updateChangeStatus, addChangeRequest } = useProject();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [impactDays, setImpactDays] = useState(0);
  const [impactCost, setImpactCost] = useState(0);
  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addChangeRequest({
      title: title.trim(),
      requestedBy: requestedBy.trim(),
      impactDays: Number(impactDays) || 0,
      impactCost: Number(impactCost) || 0,
      status: 'Pending Approval',
      description: description.trim(),
      justification: justification.trim() || 'Required for project objective fulfillment.',
    });

    setTitle('');
    setDescription('');
    setJustification('');
    setIsFormOpen(false);
  };

  const pendingCount = project.changeRequests.filter(
    (c) => c.status === 'Pending Approval'
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
          <span className="text-emerald-700 font-semibold">Change Management</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>Change Management & Scope Governance</span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono font-medium">
                {project.code}
              </span>
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Formal Change Request (CR) workflow, budget and timeline impact modeling, and approval sign-off.
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
                form="change-form"
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
              Submit Project Change Request
            </button>
          )}
        </div>
      </div>

      {/* CHANGE SUMMARY BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-amber-50/30 border-amber-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-amber-900">Pending Approvals</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-800">{pendingCount}</div>
          <p className="text-xs text-amber-700 mt-1">
            Requires Project Sponsor & Client sign-off
          </p>
        </Card>

        <Card className="p-4 bg-emerald-50/30 border-emerald-200">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-emerald-900">Approved Variations</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">
            {project.changeRequests.filter((c) => c.status === 'Approved').length}
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            Incorporated into active project baseline
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-slate-700">Rejected Requests</span>
            <XCircle className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-700">
            {project.changeRequests.filter((c) => c.status === 'Rejected').length}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Excluded to preserve contract schedule
          </p>
        </Card>
      </div>

      {/* DEDICATED SECTION: SUBMIT PROJECT CHANGE REQUEST */}
      {isFormOpen && (
        <Card className="p-5 border-emerald-200/80 bg-white shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 gap-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-600 text-white">
                <Plus className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  Submit Project Change Request
                </h2>
                <p className="text-xs text-slate-500">
                  Submit a formal scope, cost, or schedule modification scoped directly to {project.name}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold flex items-center gap-1.5">
              <FolderGit2 className="h-3.5 w-3.5 text-emerald-600" />
              Project: {project.code}
            </span>
          </div>

          <form id="change-form" onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Request Title *
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
                  Requested By (Stakeholder / Designation)
                </label>
                <input
                  type="text"
                  placeholder=""
                  value={requestedBy}
                  onChange={(e) => setRequestedBy(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Schedule Impact (Days)
                </label>
                <input
                  type="number"
                  min="0"
                  value={impactDays}
                  onChange={(e) => setImpactDays(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Budget Impact ($ USD)
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={impactCost}
                  onChange={(e) => setImpactCost(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Scope Modification Description *
                </label>
                <textarea
                  rows={2}
                  placeholder=""
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Business Justification
                </label>
                <textarea
                  rows={2}
                  placeholder=""
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
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

      {/* CHANGE REQUEST CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-slate-800">
              Active Project Change Log ({project.changeRequests.length})
            </h2>
          </div>
        </div>

        {project.changeRequests.length === 0 ? (
          <Card className="p-8 text-center text-slate-400 text-xs">
            No change requests currently logged for this project.
          </Card>
        ) : (
          project.changeRequests.map((change) => {
            const isApproved = change.status === 'Approved';
            const isRejected = change.status === 'Rejected';
            const isPending = change.status === 'Pending Approval';

            return (
              <Card key={change.id} className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {change.code}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {change.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Requested by <strong>{change.requestedBy}</strong> • Date: {change.dateRequested}
                    </p>
                  </div>

                  <Badge
                    variant={
                      isApproved ? 'success' : isRejected ? 'danger' : isPending ? 'warning' : 'info'
                    }
                    size="sm"
                  >
                    {change.status}
                  </Badge>
                </div>

                {/* Impact details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Timeline Impact</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      +{change.impactDays} Days
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Cost Impact</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      +${change.impactCost.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Approval Level</span>
                    <span className="font-semibold text-slate-800">
                      Steering Committee
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-0.5">Scope Baseline</span>
                    <span className="font-semibold text-slate-800">
                      {isApproved ? 'Updated' : 'Pending'}
                    </span>
                  </div>
                </div>

                {/* Description & Justification */}
                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Scope Modification Description
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {change.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                      Business Justification
                    </span>
                    <p className="text-slate-600 leading-relaxed">
                      {change.justification}
                    </p>
                  </div>
                </div>

                {/* Interactive Approval Controls */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Current Status: <strong>{change.status}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateChangeStatus(change.id, 'Under Review')}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                    >
                      Set Under Review
                    </button>
                    <button
                      onClick={() => updateChangeStatus(change.id, 'Rejected')}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
                    >
                      Reject CR
                    </button>
                    <button
                      onClick={() => updateChangeStatus(change.id, 'Approved')}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approve Variation
                    </button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
