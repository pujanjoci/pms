'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Stakeholder, CommunicationEvent } from '@/types/project';
import {
  Users2,
  MessageSquare,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  UserPlus,
  CalendarPlus,
} from 'lucide-react';

const inputCls =
  'w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all';

const labelCls = 'block text-xs font-semibold text-slate-700 mb-1';

// ─── Add Stakeholder Form ───────────────────────────────────────────────────
function AddStakeholderForm({ onClose }: { onClose: () => void }) {
  const { addStakeholder } = useProject();
  const [form, setForm] = useState<Omit<Stakeholder, 'id'>>({
    name: '',
    role: '',
    organization: '',
    interest: 'High',
    influence: 'High',
    communicationFreq: '',
    engagementStatus: 'Neutral',
    contact: '',
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addStakeholder(form);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
    >
      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <UserPlus className="h-3.5 w-3.5 text-neutral-800" />
        New Stakeholder
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Name *</label>
          <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Role / Title</label>
          <input className={inputCls} value={form.role} onChange={(e) => set('role', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Organization</label>
          <input className={inputCls} value={form.organization} onChange={(e) => set('organization', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Contact / Label</label>
          <input className={inputCls} value={form.contact} onChange={(e) => set('contact', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Communication Frequency</label>
          <input className={inputCls} placeholder="e.g. Weekly, Bi-weekly" value={form.communicationFreq} onChange={(e) => set('communicationFreq', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Engagement Status</label>
          <select className={inputCls} value={form.engagementStatus} onChange={(e) => set('engagementStatus', e.target.value as Stakeholder['engagementStatus'])}>
            <option>Champion</option>
            <option>Supportive</option>
            <option>Neutral</option>
            <option>Requires Attention</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Influence</label>
          <select className={inputCls} value={form.influence} onChange={(e) => set('influence', e.target.value as Stakeholder['influence'])}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Interest</label>
          <select className={inputCls} value={form.interest} onChange={(e) => set('interest', e.target.value as Stakeholder['interest'])}>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Stakeholder
        </button>
      </div>
    </form>
  );
}

// ─── Add Communication Event Form ───────────────────────────────────────────
function AddCommEventForm({ onClose }: { onClose: () => void }) {
  const { addCommunicationEvent } = useProject();
  const [form, setForm] = useState<Omit<CommunicationEvent, 'id'>>({
    activity: '',
    audience: '',
    frequency: '',
    channel: '',
    owner: '',
    deliverable: '',
  });

  const set = (key: keyof typeof form, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.activity.trim()) return;
    addCommunicationEvent(form);
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
    >
      <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
        <CalendarPlus className="h-3.5 w-3.5 text-neutral-800" />
        New Communication Event
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className={labelCls}>Activity / Meeting Name *</label>
          <input className={inputCls} value={form.activity} onChange={(e) => set('activity', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Target Audience</label>
          <input className={inputCls} value={form.audience} onChange={(e) => set('audience', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Frequency & Schedule</label>
          <input className={inputCls} placeholder="e.g. Every Monday 10:00 AM" value={form.frequency} onChange={(e) => set('frequency', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Channel / Format</label>
          <input className={inputCls} placeholder="e.g. Microsoft Teams, Email" value={form.channel} onChange={(e) => set('channel', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Owner</label>
          <input className={inputCls} value={form.owner} onChange={(e) => set('owner', e.target.value)} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Key Deliverable</label>
          <input className={inputCls} placeholder="e.g. Sprint Backlog & Blocker Log" value={form.deliverable} onChange={(e) => set('deliverable', e.target.value)} />
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-1">
        <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
          Cancel
        </button>
        <button type="submit" className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors">
          <Plus className="h-3.5 w-3.5" />
          Add Event
        </button>
      </div>
    </form>
  );
}

// ─── Main View ───────────────────────────────────────────────────────────────
export function StakeholdersView() {
  const { project, deleteStakeholder, deleteCommunicationEvent, authUser } = useProject();
  const [showStakeholderForm, setShowStakeholderForm] = useState(false);
  const [showCommForm, setShowCommForm] = useState(false);

  const stakeholders = project.stakeholders ?? [];
  const commPlan = project.communicationPlan ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>Projects</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">{project.name}</span>
          <span>/</span>
          <span className="text-neutral-900 font-semibold">Stakeholders & Comm</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Stakeholder Engagement & Communication Plan
        </h1>
        {/* <p className="text-sm text-slate-500 mt-1">
          Stakeholder matrix, influence and interest mapping, recurring governance cadences, and reporting channels.
        </p> */}
      </div>

      {/* ── STAKEHOLDER REGISTRY ─────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-neutral-800" />
            <h3 className="text-base font-bold text-slate-900">
              Key Stakeholder Register ({stakeholders.length})
            </h3>
          </div>
          {authUser?.isManager && (
            <button
              onClick={() => setShowStakeholderForm((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors"
            >
              {showStakeholderForm ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              {showStakeholderForm ? 'Close Form' : 'Add Stakeholder'}
            </button>
          )}
        </div>

        {showStakeholderForm && (
          <AddStakeholderForm onClose={() => setShowStakeholderForm(false)} />
        )}

        {stakeholders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Users2 className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-500">No stakeholders added yet</p>
            <p className="text-xs text-slate-400 mt-1">
              {authUser?.isManager ? 'Click "Add Stakeholder" to register your first stakeholder.' : 'Log in as Manager to add stakeholders.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stakeholders.map((stk) => {
              const isChampion = stk.engagementStatus === 'Champion';
              const isHighPower = stk.influence === 'High' && stk.interest === 'High';
              return (
                <Card
                  key={stk.id}
                  className={`p-4 transition-all ${isHighPower ? 'border-neutral-300 bg-neutral-50/50' : 'border-slate-200'}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{stk.name}</h4>
                      {stk.role !== stk.name && (
                        <p className="text-xs text-slate-500 truncate">{stk.role}</p>
                      )}
                      <span className="inline-block text-[11px] font-medium text-slate-400 mt-0.5">
                        {stk.organization}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant={isChampion ? 'success' : 'neutral'} size="sm" dot>
                        {stk.engagementStatus}
                      </Badge>
                      {authUser?.isManager && (
                        <button
                          onClick={() => deleteStakeholder(stk.id)}
                          className="p-1 rounded text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Remove stakeholder"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Influence</span>
                        <Badge variant={stk.influence === 'High' ? 'danger' : 'neutral'} size="sm" className="mt-0.5">
                          {stk.influence} Power
                        </Badge>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Interest</span>
                        <Badge variant={stk.interest === 'High' ? 'success' : 'neutral'} size="sm" className="mt-0.5">
                          {stk.interest} Interest
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 truncate">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{stk.communicationFreq || '—'}</span>
                      </span>
                      {stk.contact && (
                        <span className="text-[11px] font-mono text-slate-400 truncate ml-2">
                          {stk.contact}
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── COMMUNICATION PLAN TABLE ─────────────────────────────────── */}
      <Card>
        <CardHeader
          title="Formal Project Communication Plan & Cadence"
          // subtitle="Pre-scheduled governance syncs, recurring milestone deliverables, and recipient distribution lists."
          icon={<MessageSquare className="h-4 w-4 text-neutral-800" />}
          action={
            authUser?.isManager ? (
              <button
                onClick={() => setShowCommForm((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg shadow-xs transition-colors"
              >
                {showCommForm ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                {showCommForm ? 'Close Form' : 'Add Event'}
              </button>
            ) : undefined
          }
        />

        {showCommForm && (
          <div className="px-4 pb-2">
            <AddCommEventForm onClose={() => setShowCommForm(false)} />
          </div>
        )}

        {commPlan.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-t border-slate-100">
            <MessageSquare className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-500">No communication events yet</p>
            <p className="text-xs text-slate-400 mt-1">
              {authUser?.isManager ? 'Click "Add Event" to log your first communication cadence.' : 'Log in as Manager to add events.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600" style={{ minWidth: '700px' }}>
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Cadence Activity</th>
                  <th className="py-3 px-3">Target Audience</th>
                  <th className="py-3 px-3">Frequency & Schedule</th>
                  <th className="py-3 px-3">Channel / Format</th>
                  <th className="py-3 px-3">Owner</th>
                  <th className="py-3 px-4">Key Deliverable</th>
                  {authUser?.isManager && <th className="py-3 px-3 w-10" />}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {commPlan.map((comm) => (
                  <tr key={comm.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 text-xs">{comm.activity}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-medium text-slate-700">{comm.audience}</span>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge variant="purple" size="sm">{comm.frequency}</Badge>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500">{comm.channel}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-800 whitespace-nowrap">{comm.owner}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-neutral-800 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded text-[11px]">
                        {comm.deliverable}
                      </span>
                    </td>
                    {authUser?.isManager && (
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => deleteCommunicationEvent(comm.id)}
                          className="p-1 rounded text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Remove event"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
