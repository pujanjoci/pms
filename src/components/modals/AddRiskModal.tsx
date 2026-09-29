'use client';

import React, { useState, useEffect } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Modal } from '@/components/common/Modal';
import { RiskItem } from '@/types/project';

export function AddRiskModal() {
  const { activeModal, closeModal, addRisk, project } = useProject();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RiskItem['category']>('Technical');
  const [probability, setProbability] = useState<RiskItem['probability']>('Medium');
  const [impact, setImpact] = useState<RiskItem['impact']>('High');
  const [owner, setOwner] = useState('');
  const [status, setStatus] = useState<RiskItem['status']>('Monitoring');
  const [action, setAction] = useState('');

  // Sync owner to first team member when modal opens
  const teamMembers = project.teamMembers ?? [];
  useEffect(() => {
    if (activeModal === 'add-risk' && teamMembers.length > 0) {
      setOwner((prev) => prev || teamMembers[0].name);
    }
  }, [activeModal, teamMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !action.trim()) return;

    addRisk({
      title,
      category,
      probability,
      impact,
      riskScore: 0, // calculated in context
      owner,
      status,
      action,
    });

    setTitle('');
    setAction('');
  };

  return (
    <Modal
      isOpen={activeModal === 'add-risk'}
      onClose={closeModal}
      title="Log Project Risk"
      subtitle="Record a potential threat or uncertainty with mitigation plan."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Risk Event Statement *
          </label>
          <input
            type="text"
            required
            placeholder=""
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as RiskItem['category'])}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              <option value="Technical">Technical</option>
              <option value="Schedule">Schedule</option>
              <option value="Budget">Budget</option>
              <option value="Operational">Operational</option>
              <option value="External">External</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Probability
            </label>
            <select
              value={probability}
              onChange={(e) => setProbability(e.target.value as RiskItem['probability'])}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Impact
            </label>
            <select
              value={impact}
              onChange={(e) => setImpact(e.target.value as RiskItem['impact'])}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Risk Owner
            </label>
            <select
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              {(project.teamMembers ?? []).map((member) => (
                <option key={member.id} value={member.name}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RiskItem['status'])}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              <option value="Monitoring">Monitoring</option>
              <option value="Open">Open</option>
              <option value="Mitigated">Mitigated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Mitigation & Contingency Action *
          </label>
          <textarea
            required
            rows={3}
            placeholder=""
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-xs transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}
