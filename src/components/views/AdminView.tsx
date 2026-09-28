'use client';

import React, { useState } from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader } from '@/components/common/Card';
import {
  ShieldAlert,
  Database,
  RotateCcw,
  Lock,
  Unlock,
  AlertTriangle,
  HardDrive,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export function AdminView() {
  const {
    projects,
    project,
    authUser,
    openAuthModal,
    resetAllData,
  } = useProject();

  const [confirmReset, setConfirmReset] = useState(false);

  // Storage analytics
  const totalProjectsCount = Object.keys(projects).length;
  const totalRisksCount = Object.values(projects).reduce(
    (acc, p) => acc + (p.risks?.length || 0),
    0
  );
  const totalChangeRequestsCount = Object.values(projects).reduce(
    (acc, p) => acc + (p.changeRequests?.length || 0),
    0
  );
  const totalIssuesCount = Object.values(projects).reduce(
    (acc, p) => acc + (p.issues?.length || 0),
    0
  );

  const handleResetExecute = () => {
    resetAllData();
    setConfirmReset(false);
  };

  // If visitor is not authenticated as Manager, show lock screen
  if (!authUser?.isManager) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center animate-in fade-in duration-200">
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 inline-flex items-center justify-center text-amber-600 mb-4 shadow-xs">
          <Lock className="h-8 w-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Restricted Administration Area
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed max-w-md mx-auto">
          System administration and global data reset utilities are restricted to authenticated Project Managers to prevent accidental data loss.
        </p>
        <button
          onClick={openAuthModal}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm inline-flex items-center gap-2 transition-colors"
        >
          <Unlock className="h-4 w-4" />
          Authenticate as Project Manager
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Breadcrumbs & Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
          <span>System</span>
          <span>/</span>
          <span className="text-slate-700 font-medium">Administration</span>
          <span>/</span>
          <span className="text-rose-600 font-semibold">Data Reset</span>
        </div>
        {/* <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>System Admin & Data Governance</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                Manager Authenticated
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage client-side localStorage persistence, storage analytics, and execute administrative factory resets.
            </p>
          </div>
        </div> */}
      </div>

      {/* METRICS / STORAGE STATUS */}
      {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Stored Projects</span>
            <HardDrive className="h-3.5 w-3.5 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalProjectsCount}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Active in LocalStorage</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Total Risks Logged</span>
            <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalRisksCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all projects</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Change Requests</span>
            <Layers className="h-3.5 w-3.5 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalChangeRequestsCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Audit log records</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-semibold text-slate-700">Bugs & Issues</span>
            <Database className="h-3.5 w-3.5 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalIssuesCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tracked quality defects</p>
        </Card>
      </div> */}

      {/* STORAGE INFO CARD */}
      {/* <Card className="p-5 border-slate-200">
        <CardHeader
          title="LocalStorage Architecture & Persistence State"
          subtitle="All changes to risks, change requests, budget items, RACI matrices, and schedule milestones are synchronized immediately."
        />
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-0.5 font-mono text-[10px]">STORAGE KEY</span>
            <span className="font-mono font-semibold text-slate-800">pms_projects_data</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-slate-400 block mb-0.5 font-mono text-[10px]">ACTIVE SCOPE</span>
            <span className="font-medium text-slate-800">{project.name} ({project.code})</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-slate-400 block mb-0.5 font-mono text-[10px]">STATUS</span>
              <span className="font-semibold text-emerald-700">Real-time Synced</span>
            </div>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      </Card> */}

      {/* SECURE DATA RESET SECTION */}
      <Card className="p-6 border-rose-200 bg-rose-50/15">
        <div className="flex items-start gap-3.5">

          <div className="flex-1">
            <h3 className="text-base font-bold text-slate-900">
              Reset Application Data
            </h3>
            {/* <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-2xl">
              This operation clears all locally modified projects, custom risks, newly added budget lines, milestones, and RACI deliverables, restoring default baseline datasets for all 3 projects. This action cannot be undone.
            </p> */}

            {!confirmReset ? (
              <div className="mt-5">
                <button
                  onClick={() => setConfirmReset(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset All Application Data
                </button>
              </div>
            ) : (
              <div className="mt-4 p-4 rounded-xl bg-white border border-rose-300 shadow-sm max-w-lg space-y-3">
                <div className="flex items-center gap-2 text-rose-700 text-xs font-bold">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Are you sure you want to restore default prototype data?</span>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  All custom user data entered into DPR-2026, ECM-2026, and CPV-2026 will be replaced by the original clean templates.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={handleResetExecute}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
                  >
                    Yes, Reset Everything
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
