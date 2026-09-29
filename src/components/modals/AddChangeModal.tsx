'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Modal } from '@/components/common/Modal';

export function AddChangeModal() {
  const { activeModal, closeModal, addChangeRequest } = useProject();

  const [title, setTitle] = useState('');
  const [requestedBy, setRequestedBy] = useState('');
  const [impactDays, setImpactDays] = useState(0);
  const [impactCost, setImpactCost] = useState(0);
  const [description, setDescription] = useState('');
  const [justification, setJustification] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addChangeRequest({
      title,
      requestedBy,
      impactDays: Number(impactDays) || 0,
      impactCost: Number(impactCost) || 0,
      status: 'Pending Approval',
      description,
      justification,
    });

    setTitle('');
    setDescription('');
    setJustification('');
  };

  return (
    <Modal
      isOpen={activeModal === 'add-change'}
      onClose={closeModal}
      title="Submit Change Request"
      subtitle="Propose a formal scope, budget, or timeline variation."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Change Title *
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

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Requested By
          </label>
          <input
            type="text"
            required
            placeholder=""
            value={requestedBy}
            onChange={(e) => setRequestedBy(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Schedule Impact (+Days)
            </label>
            <input
              type="number"
              value={impactDays}
              onChange={(e) => setImpactDays(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Cost Impact (+$ USD)
            </label>
            <input
              type="number"
              value={impactCost}
              onChange={(e) => setImpactCost(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Detailed Scope Description *
          </label>
          <textarea
            required
            rows={2}
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Business Justification
          </label>
          <textarea
            rows={2}
            placeholder=""
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
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
