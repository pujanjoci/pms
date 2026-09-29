'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Modal } from '@/components/common/Modal';
import { ScopeItem } from '@/types/project';

export function EditScopeModal() {
  const { activeModal, closeModal, addScopeItem } = useProject();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Core Pages');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Completed' | 'In Progress' | 'Planned'>('Planned');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addScopeItem({
      title,
      category,
      description,
      status,
    });

    setTitle('');
    setDescription('');
  };

  return (
    <Modal
      isOpen={activeModal === 'edit-scope'}
      onClose={closeModal}
      title="Add In-Scope Deliverable"
      subtitle="Define a verified scope item approved within the Project Charter."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Deliverable Title *
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              required
              placeholder=""
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Delivery Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ScopeItem['status'])}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
            >
              <option value="Planned">Planned</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Functional Description & Acceptance Criteria *
          </label>
          <textarea
            required
            rows={3}
            placeholder=""
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
