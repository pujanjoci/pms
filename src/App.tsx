import React from 'react';
import { ProjectProvider, useProject } from '@/context/ProjectContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Toaster } from 'react-hot-toast';
import { FolderPlus, LayoutDashboard } from 'lucide-react';

// Views
import { DashboardView } from '@/components/views/DashboardView';
import { OverviewView } from '@/components/views/OverviewView';
import { ScheduleView } from '@/components/views/ScheduleView';
import { BudgetView } from '@/components/views/BudgetView';
import { RisksView } from '@/components/views/RisksView';
import { StakeholdersView } from '@/components/views/StakeholdersView';
import { QualityView } from '@/components/views/QualityView';
import { ChangesView } from '@/components/views/ChangesView';
import { TeamView } from '@/components/views/TeamView';
import { KanbanView } from '@/components/views/KanbanView';
import { FinalReportView } from '@/components/views/FinalReportView';
import { AdminView } from '@/components/views/AdminView';

// Modals
import { AddTaskModal } from '@/components/modals/AddTaskModal';
import { AddRiskModal } from '@/components/modals/AddRiskModal';
import { AddChangeModal } from '@/components/modals/AddChangeModal';
import { AddIssueModal } from '@/components/modals/AddIssueModal';
import { EditScopeModal } from '@/components/modals/EditScopeModal';
import { LoginModal } from '@/components/modals/LoginModal';
import { CreateProjectModal } from '@/components/modals/CreateProjectModal';

function EmptyProjectsScreen() {
  const { openModal, authUser, openAuthModal } = useProject();

  const handleCreate = () => {
    if (!authUser?.isManager) {
      openAuthModal();
      return;
    }
    openModal('create-project');
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] text-center px-6">
      <div className="relative mb-6">
        <div className="h-24 w-24 rounded-sm bg-neutral-100 border-2 border-neutral-200 flex items-center justify-center shadow-sm">
          <LayoutDashboard className="h-10 w-10 text-neutral-400" />
        </div>
        <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-sm bg-white border-2 border-neutral-300 flex items-center justify-center shadow-sm">
          <FolderPlus className="h-4 w-4 text-neutral-800" />
        </div>
      </div>

      <h2 className="text-lg font-bold text-slate-800 mb-2">No Projects Yet</h2>
      <p className="text-sm text-slate-500 max-w-sm mb-8 leading-relaxed">
        Get started by creating your first project.
      </p>

      <button
        onClick={handleCreate}
        className="flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-sm shadow-md hover:shadow-lg transition-all"
      >
        <FolderPlus className="h-4 w-4" />
        Create Your First Project
      </button>

      {!authUser?.isManager && (
        <p className="mt-4 text-xs text-slate-400">
          You need to{' '}
          <button
            onClick={openAuthModal}
            className="text-neutral-900 font-semibold hover:underline"
          >
            log in
          </button>{' '}
          to create projects.
        </p>
      )}
    </div>
  );
}

function AppContent() {
  const { currentView, projectsList } = useProject();

  const hasProjects = projectsList.length > 0;

  const renderActiveView = () => {
    if (!hasProjects) {
      return <EmptyProjectsScreen />;
    }

    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'overview':
        return <OverviewView />;
      case 'schedule':
        return <ScheduleView />;
      case 'budget':
        return <BudgetView />;
      case 'risks':
        return <RisksView />;
      case 'stakeholders':
        return <StakeholdersView />;
      case 'quality':
        return <QualityView />;
      case 'changes':
        return <ChangesView />;
      case 'team':
        return <TeamView />;
      case 'kanban':
        return <KanbanView />;
      case 'final-report':
        return <FinalReportView />;
      case 'admin':
        return <AdminView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Persistent Top Header */}
        <Header />

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Interactive Modals */}
      <AddTaskModal />
      <AddRiskModal />
      <AddChangeModal />
      <AddIssueModal />
      <EditScopeModal />
      <LoginModal />
      <CreateProjectModal />

      {/* Smoking Hot Toast Notifications */}
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#18181b',
            color: '#fafafa',
            fontSize: '13px',
            fontWeight: 500,
            borderRadius: '8px',
            padding: '10px 16px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
            width: 'fit-content',
            maxWidth: 'min(420px, calc(100vw - 24px))',
            boxSizing: 'border-box',
            overflowWrap: 'anywhere',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-xl mx-auto my-12 bg-white rounded-xl border border-rose-200 shadow-sm text-center">
          <h2 className="text-lg font-bold text-rose-600 mb-2">Application Notice</h2>
          <p className="text-xs text-slate-600 mb-4 font-mono bg-slate-50 p-3 rounded border border-slate-200 text-left overflow-auto">
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ProjectProvider>
        <AppContent />
      </ProjectProvider>
    </ErrorBoundary>
  );
}
