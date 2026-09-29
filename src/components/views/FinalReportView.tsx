'use client';

import React from 'react';
import { useProject } from '@/context/ProjectContext';
import { Card, CardHeader, CardContent } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import {
  AlertTriangle,
  Printer,
  Download,
  Lightbulb,
  Sparkles,
} from 'lucide-react';

export function FinalReportView() {
  const { project, showToast } = useProject();

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    showToast('Executive Management Report exported to PDF format');
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
          <span className="text-emerald-700 font-semibold">Final Recommendation</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Management Report
            </h1>
            {/* <p className="text-sm text-slate-500 mt-1">
              Synthesized stage gate audit, variance root cause findings, and prototype-generated executive recommendations.
            </p> */}
          </div>
          <div className="flex items-center gap-2.5 no-print">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Report
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              Export Executive Brief
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY OVERVIEW CARD */}
      <Card className="border-emerald-200 bg-gradient-to-br from-white via-white to-emerald-50/20">
        <div className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800">
                  {project.code} • GATE 4 REVIEW
                </span>
                {/* <Badge variant="success" dot>
                  {project.status}
                </Badge> */}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
                Executive Project Status Synthesis
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Prepared by Project Manager
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Delivery Health
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {project.health.overall} ({project.progress}%)
                </span>
              </div>
              <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-center shadow-2xs">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Target Cutover
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {project.targetDate || 'TBD'}
                </span>
              </div>
            </div>
          </div>

          {/* Baseline vs Actual Performance Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Completion Rate
              </span>
              <span className="text-lg font-bold text-emerald-600">{project.progress}%</span>
              <ProgressBar value={project.progress} color="emerald" size="xs" showPercent={false} />
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Schedule Variance
              </span>
              <span className="text-lg font-bold text-amber-700">+{project.scheduleVarianceDays} Days Lag</span>
              <p className="text-[10px] text-amber-600">
                {project.scheduleVarianceDays > 0 ? `+${project.scheduleVarianceDays}d variance` : 'On schedule'}
              </p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Budget Variance
              </span>
              <span className="text-lg font-bold text-amber-700">+{project.budgetVariancePercent}% CV</span>
              <p className="text-[10px] text-slate-500">${project.spentBudget.toLocaleString()} / ${project.totalBudget.toLocaleString()}</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Quality Pass Rate
              </span>
              <span className="text-lg font-bold text-emerald-600">
                {project.qualityMetrics.testsPassedPercent}%
              </span>
              <p className="text-[10px] text-emerald-700">{project.qualityMetrics.criticalBugs} Critical defects</p>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Risk Posture
              </span>
              <span className="text-lg font-bold text-slate-800">
                {project.risks.filter((r) => r.status === 'Monitoring').length} Monitoring
              </span>
              <p className="text-[10px] text-slate-500">
                {project.risks.filter((r) => r.status === 'Mitigated' || r.status === 'Closed').length} Mitigated / Closed
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* KEY FINDINGS */}
      <Card>
        <CardHeader
          title="Key Findings & Root Cause Analysis"
          // subtitle="Observed performance variances derived from cross-section project metrics."
          icon={<AlertTriangle className="h-4 w-4 text-amber-500" />}
        />
        <CardContent className="space-y-3">
          {project.keyFindings && project.keyFindings.length > 0 ? (
            project.keyFindings.map((finding, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-3"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  0{idx + 1}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {finding}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">
              No diagnostic key findings logged yet. Metrics and variance observations will appear here.
            </p>
          )}
        </CardContent>
      </Card>

      {/* EVIDENCE-BASED INSIGHTS */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Evidence-Based Insights
          </h3>
        </div>

        {project.insights && project.insights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.insights.map((insight, idx) => {
              const isWarning = insight.status === 'warning';

              return (
                <Card
                  key={idx}
                  className={`p-4 transition-all ${isWarning ? 'border-amber-200 bg-amber-50/15' : 'border-emerald-200 bg-emerald-50/15'
                    }`}
                >
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        {insight.category} Dimension
                      </span>
                    </div>
                    <Badge variant={isWarning ? 'warning' : 'success'} size="sm">
                      {insight.metric}
                    </Badge>
                  </div>

                  <div className="pt-2.5 space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">
                      {insight.headline}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {insight.detail}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-6 text-center text-xs text-slate-400">
            No management insights generated yet.
          </Card>
        )}
      </div>

      {/* FINAL STRATEGIC MANAGEMENT RECOMMENDATIONS */}
      {/* <Card className="border-emerald-200/90 shadow-sm">
        <CardHeader
          title="Recommended Corrective Action Plan"
          subtitle="Prototype-generated governance interventions to protect launch date and budget threshold."
          icon={<Sparkles className="h-4 w-4 text-emerald-600" />}
          action={
            <Badge variant="success" size="sm">
              Approved for Execution
            </Badge>
          }
        />
        <CardContent className="divide-y divide-slate-100 p-0">
          {project.recommendations && project.recommendations.length > 0 ? (
            project.recommendations.map((rec, index) => {
              const isHigh = rec.priority === 'High';

              return (
                <div key={rec.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-md bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {rec.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isHigh ? 'danger' : 'warning'} size="sm">
                        {rec.priority} Priority
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">
                        {rec.timeline}
                      </span>
                    </div>
                  </div>

                  <div className="pl-8 space-y-2 text-xs">
                    <p className="text-slate-700 leading-relaxed font-medium">
                      <strong className="text-slate-900">Action Plan: </strong>
                      {rec.action}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-slate-500 pt-1">
                      <span>
                        Responsible Lead: <strong className="text-slate-800">{rec.owner}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">
                        Target Impact: {rec.impact}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-400">
              No corrective action recommendations logged yet.
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}
