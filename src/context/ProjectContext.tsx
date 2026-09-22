'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  ProjectData,
  KanbanTask,
  RiskItem,
  ChangeRequest,
  IssueItem,
  ScopeItem,
  NotificationItem,
  ProjectSummary,
  AuthUser,
  BudgetCategory,
  SchedulePhase,
  Milestone,
  TeamMember,
  RACIRow,
  RACIRole,
  Stakeholder,
  CommunicationEvent,
} from '@/types/project';
import {
  initialProjectsMap,
  initialNotifications,
} from '@/data/projectData';
import toast from 'react-hot-toast';

export type ViewType =
  | 'dashboard'
  | 'overview'
  | 'schedule'
  | 'budget'
  | 'risks'
  | 'stakeholders'
  | 'quality'
  | 'changes'
  | 'team'
  | 'kanban'
  | 'final-report'
  | 'admin';

export type ModalType =
  | 'add-task'
  | 'add-risk'
  | 'add-change'
  | 'add-issue'
  | 'edit-scope'
  | 'create-project'
  | null;

const STORAGE_KEY_PROJECTS = 'pms_projects_data_v4';
const STORAGE_KEY_ACTIVE_ID = 'pms_active_project_id_v4';
const STORAGE_KEY_AUTH_USER = 'pms_auth_user';

interface ProjectContextType {
  // Multi-project
  projects: Record<string, ProjectData>;
  project: ProjectData;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  projectsList: ProjectSummary[];
  addProject: (project: ProjectData) => void;

  // Views & UI
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeModal: ModalType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;

  // Authentication & Permissions
  authUser: AuthUser | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (name?: string, role?: string, email?: string) => void;
  logout: () => void;
  requireManagerAuth: (action: () => void) => boolean;

  // Kanban
  moveKanbanTask: (taskId: string, targetColumn: KanbanTask['column']) => void;
  addKanbanTask: (task: Omit<KanbanTask, 'id'>) => void;

  // Risk Register (Project scoped)
  addRisk: (risk: Omit<RiskItem, 'id' | 'code' | 'dateLogged'>) => void;
  updateRiskStatus: (riskId: string, status: RiskItem['status']) => void;
  deleteRisk: (riskId: string) => void;

  // Changes
  addChangeRequest: (change: Omit<ChangeRequest, 'id' | 'code' | 'dateRequested'>) => void;
  updateChangeStatus: (changeId: string, status: ChangeRequest['status']) => void;

  // Quality & Bugs
  toggleQualityCheck: (id: string) => void;
  updateIssueStatus: (issueId: string, status: IssueItem['status']) => void;
  addIssue: (issue: Omit<IssueItem, 'id' | 'code'>) => void;

  // Scope & Objectives
  addScopeItem: (item: Omit<ScopeItem, 'id'>) => void;
  toggleObjective: (id: string) => void;

  // Budget & Resources
  addBudgetCategory: (item: Omit<BudgetCategory, 'id' | 'variance'>) => void;
  updateResourceAllocation: (memberId: string, allocation: number, status?: TeamMember['workloadStatus']) => void;

  // Schedule & Milestones
  addSchedulePhase: (phase: Omit<SchedulePhase, 'id'>) => void;
  addMilestone: (milestone: Omit<Milestone, 'id'>) => void;

  // Team & RACI
  addTeamMember: (member: Omit<TeamMember, 'id'>) => void;
  deleteTeamMember: (memberId: string) => void;
  addRaciDeliverable: (row: RACIRow) => void;
  updateRaciCell: (deliverableIndex: number, roleKey: keyof Omit<RACIRow, 'deliverable' | 'category'>, value: RACIRole) => void;
  deleteRaciDeliverable: (deliverableIndex: number) => void;

  // Stakeholders & Communication
  addStakeholder: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  deleteStakeholder: (stakeholderId: string) => void;
  addCommunicationEvent: (event: Omit<CommunicationEvent, 'id'>) => void;
  deleteCommunicationEvent: (eventId: string) => void;

  // System Administration & Reset
  resetAllData: () => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  // Load saved projects from localStorage — starts empty if no user data exists
  const [projects, setProjects] = useState<Record<string, ProjectData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read projects from localStorage:', e);
    }
    return initialProjectsMap as Record<string, ProjectData>;
  });

  // Active Project ID — resolves to first available project or empty string
  const [activeProjectId, setActiveProjectIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return '';
  });

  // Auth User (null = Guest / Normal Visitor, object = Project Manager)
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize projects to localStorage whenever projects state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  // Synchronize activeProjectId to localStorage
  const setActiveProjectId = (id: string) => {
    setActiveProjectIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } catch {
      // ignore
    }
    showToast(`Switched active project to ${projects[id]?.name || id}`);
  };

  // Synchronize authUser to localStorage
  useEffect(() => {
    try {
      if (authUser) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(authUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch {
      // ignore
    }
  }, [authUser]);

  // Active Project Data — undefined when no projects exist yet
  const project: ProjectData = projects[activeProjectId] || Object.values(projects)[0] || ({} as ProjectData);

  // Dynamic projects list — status is derived from scheduleVarianceDays so it
  // always matches what the dashboard shows (not the static field set at creation).
  const projectsList: ProjectSummary[] = Object.values(projects).map((p) => {
    const variance = p.scheduleVarianceDays ?? 0;
    const derivedStatus: ProjectData['status'] =
      variance > 7
        ? 'Delayed'
        : variance > 0
        ? 'At Risk'
        : 'On Track';
    return {
      id: p.id,
      name: p.name,
      code: p.code,
      status: derivedStatus,
      progress: p.progress,
      badge: 'Active Project',
    };
  });

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToastMessage(msg);
    if (type === 'success') {
      toast.success(msg);
    } else if (type === 'info') {
      toast(msg, { icon: 'ℹ️' });
    } else if (type === 'warning') {
      toast(msg, { icon: '⚠️' });
    } else if (type === 'error') {
      toast.error(msg);
    }
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Add a brand new project
  const addProject = (newProject: ProjectData) => {
    setProjects((prev) => ({
      ...prev,
      [newProject.id]: newProject,
    }));
    setActiveProjectIdState(newProject.id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, newProject.id);
    } catch { /* ignore */ }
    closeModal();
    showToast(`Project "${newProject.name}" created successfully!`);
  };

  const openModal = (modal: ModalType) => {
    if (requireManagerAuth(() => setActiveModal(modal))) {
      setActiveModal(modal);
    }
  };

  const closeModal = () => setActiveModal(null);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Check auth permission: if guest, prompt login; if manager, allow action
  const requireManagerAuth = (action: () => void): boolean => {
    if (authUser && authUser.isManager) {
      action();
      return true;
    }
    // Queue action for after login
    pendingActionRef.current = action;
    setIsAuthModalOpen(true);
    return false;
  };

  const login = (
    name = 'Project Manager',
    role = 'Project Manager',
    email = 'pm@pms.local'
  ) => {
    const user: AuthUser = {
      id: 'usr-pm-01',
      name,
      role,
      email,
      isManager: true,
    };
    setAuthUser(user);
    setIsAuthModalOpen(false);
    showToast(`Welcome! Authenticated as ${role}`);

    // If an action was blocked awaiting auth, execute it now
    if (pendingActionRef.current) {
      const act = pendingActionRef.current;
      pendingActionRef.current = null;
      setTimeout(() => act(), 150);
    }
  };

  const logout = () => {
    setAuthUser(null);
    showToast('Signed out to Guest Mode (Read Only)');
  };

  // Helper to mutate the active project immutably and update projects map
  const mutateActiveProject = (updater: (prev: ProjectData) => ProjectData) => {
    setProjects((all) => {
      const current = all[activeProjectId] || ({} as ProjectData);
      const updated = updater(current);
      return {
        ...all,
        [activeProjectId]: updated,
      };
    });
  };

  // Dynamic progress calculator based on tasks
  const recalculateProgress = (tasks: KanbanTask[], currentProgress: number) => {
    if (tasks.length === 0) return currentProgress;
    const completed = tasks.filter((t) => t.column === 'done').length;
    return Math.round((completed / tasks.length) * 100);
  };

  // 1. Kanban
  const moveKanbanTask = (taskId: string, targetColumn: KanbanTask['column']) => {
    mutateActiveProject((prev) => {
      const updatedTasks = prev.kanbanTasks.map((t) =>
        t.id === taskId ? { ...t, column: targetColumn } : t
      );
      const newProgress = recalculateProgress(updatedTasks, prev.progress);
      return {
        ...prev,
        kanbanTasks: updatedTasks,
        progress: newProgress,
      };
    });
    showToast(`Task moved to ${targetColumn.replace('_', ' ').toUpperCase()}`);
  };

  const addKanbanTask = (newTaskData: Omit<KanbanTask, 'id'>) => {
    const newTask: KanbanTask = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };
    mutateActiveProject((prev) => {
      const updated = [newTask, ...prev.kanbanTasks];
      return {
        ...prev,
        kanbanTasks: updated,
        progress: recalculateProgress(updated, prev.progress),
      };
    });
    closeModal();
    showToast(`Task "${newTask.title}" created successfully`);
  };

  // 2. Risk Register (Project scoped)
  const addRisk = (riskData: Omit<RiskItem, 'id' | 'code' | 'dateLogged'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const scoreMap = { Low: 2, Medium: 4, High: 6 };
        const probScore = scoreMap[riskData.probability] || 3;
        const impactScore = scoreMap[riskData.impact] || 3;
        const newRisk: RiskItem = {
          ...riskData,
          id: `risk-${Date.now()}`,
          code: `RSK-00${prev.risks.length + 1}`,
          riskScore: probScore * impactScore,
          dateLogged: 'Today',
        };
        return {
          ...prev,
          risks: [newRisk, ...prev.risks],
        };
      });
      closeModal();
      showToast(`New risk logged for project ${project.name}`);
    });
  };

  const updateRiskStatus = (riskId: string, status: RiskItem['status']) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        risks: prev.risks.map((r) => (r.id === riskId ? { ...r, status } : r)),
      }));
      showToast(`Risk status updated to ${status}`);
    });
  };

  const deleteRisk = (riskId: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        risks: prev.risks.filter((r) => r.id !== riskId),
      }));
      showToast('Risk removed from register');
    });
  };

  // 3. Change Requests
  const addChangeRequest = (changeData: Omit<ChangeRequest, 'id' | 'code' | 'dateRequested'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const newCR: ChangeRequest = {
          ...changeData,
          id: `cr-${Date.now()}`,
          code: `CR-00${prev.changeRequests.length + 1}`,
          dateRequested: 'Today',
        };
        return {
          ...prev,
          changeRequests: [newCR, ...prev.changeRequests],
        };
      });
      closeModal();
      showToast(`Change Request logged for ${project.name}`);
    });
  };

  const updateChangeStatus = (changeId: string, status: ChangeRequest['status']) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const targetChange = prev.changeRequests.find((c) => c.id === changeId);
        let updatedSpent = prev.spentBudget;
        let updatedDays = prev.scheduleVarianceDays;

        if (status === 'Approved' && targetChange && targetChange.status !== 'Approved') {
          updatedSpent += targetChange.impactCost;
          updatedDays += targetChange.impactDays;
        }

        return {
          ...prev,
          spentBudget: updatedSpent,
          remainingBudget: Math.max(0, prev.totalBudget - updatedSpent),
          scheduleVarianceDays: updatedDays,
          budgetVariancePercent: Math.round(((updatedSpent - prev.totalBudget) / prev.totalBudget) * 100),
          changeRequests: prev.changeRequests.map((c) =>
            c.id === changeId ? { ...c, status } : c
          ),
        };
      });

      const newNotification: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `Change Request ${status}`,
        message: `Change request on ${project.code} was marked as "${status}".`,
        time: 'Just now',
        type: status === 'Approved' ? 'success' : status === 'Rejected' ? 'alert' : 'info',
        read: false,
      };
      setNotifications((prev) => [newNotification, ...prev]);
      showToast(`Change request marked as ${status}`);
    });
  };

  // 4. Quality & Bugs
  const addIssue = (issueData: Omit<IssueItem, 'id' | 'code'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const newIssue: IssueItem = {
          ...issueData,
          id: `iss-${Date.now()}`,
          code: `BUG-10${prev.issues.length + 1}`,
        };
        return {
          ...prev,
          issues: [newIssue, ...prev.issues],
          qualityMetrics: {
            ...prev.qualityMetrics,
            openBugs: prev.qualityMetrics.openBugs + 1,
            criticalBugs:
              issueData.priority === 'Critical'
                ? prev.qualityMetrics.criticalBugs + 1
                : prev.qualityMetrics.criticalBugs,
          },
        };
      });
      closeModal();
      showToast(`Quality issue logged for ${project.name}`);
    });
  };

  const updateIssueStatus = (issueId: string, status: IssueItem['status']) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const updatedIssues = prev.issues.map((i) =>
          i.id === issueId ? { ...i, status } : i
        );
        const openCount = updatedIssues.filter((i) => i.status !== 'Resolved').length;
        const critCount = updatedIssues.filter(
          (i) => i.status !== 'Resolved' && i.priority === 'Critical'
        ).length;

        return {
          ...prev,
          issues: updatedIssues,
          qualityMetrics: {
            ...prev.qualityMetrics,
            openBugs: openCount,
            criticalBugs: critCount,
          },
        };
      });
      showToast(`Bug marked as ${status}`);
    });
  };

  const toggleQualityCheck = (id: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const updatedList = prev.qualityChecklist.map((item) =>
          item.id === id ? { ...item, passed: !item.passed } : item
        );
        const passedCount = updatedList.filter((i) => i.passed).length;
        const totalCount = updatedList.length || 1;
        const newPercent = Math.round((passedCount / totalCount) * 100);

        return {
          ...prev,
          qualityChecklist: updatedList,
          qualityMetrics: {
            ...prev.qualityMetrics,
            qaCompletionPercent: newPercent,
            testsPassedPercent: newPercent > 80 ? 95 : 88,
          },
        };
      });
      showToast('Quality checkpoint updated');
    });
  };

  // 5. Scope & Objectives
  const addScopeItem = (itemData: Omit<ScopeItem, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        scope: {
          ...prev.scope,
          inScope: [...prev.scope.inScope, { ...itemData, id: `scope-${Date.now()}` }],
        },
      }));
      closeModal();
      showToast(`Scope item "${itemData.title}" added to ${project.name}`);
    });
  };

  const toggleObjective = (id: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        objectives: prev.objectives.map((obj) =>
          obj.id === id ? { ...obj, completed: !obj.completed } : obj
        ),
      }));
      showToast('Objective completion status toggled');
    });
  };

  // 6. Cost, Budget & Resource Allocation
  const addBudgetCategory = (item: Omit<BudgetCategory, 'id' | 'variance'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const newCategory: BudgetCategory = {
          ...item,
          id: `b-cat-${Date.now()}`,
          variance: item.allocated - item.spent,
        };
        const updatedBreakdown = [...prev.budgetBreakdown, newCategory];
        const updatedAllocated = updatedBreakdown.reduce((sum, b) => sum + b.allocated, 0);
        const updatedSpent = updatedBreakdown.reduce((sum, b) => sum + b.spent, 0);
        return {
          ...prev,
          totalBudget: updatedAllocated,
          spentBudget: updatedSpent,
          remainingBudget: Math.max(0, updatedAllocated - updatedSpent),
          budgetBreakdown: updatedBreakdown,
        };
      });
      showToast(`Budget category "${item.category}" added`);
    });
  };

  const updateResourceAllocation = (
    memberId: string,
    allocation: number,
    status?: TeamMember['workloadStatus']
  ) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.map((m) =>
          m.id === memberId
            ? {
                ...m,
                allocation,
                workloadStatus:
                  status || (allocation > 90 ? 'Overallocated' : allocation > 70 ? 'Optimal' : 'High'),
              }
            : m
        ),
      }));
      showToast('Resource workload allocation updated');
    });
  };

  // 7. Schedule & Milestones
  const addSchedulePhase = (phaseData: Omit<SchedulePhase, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        schedulePhases: [
          ...prev.schedulePhases,
          { ...phaseData, id: `ph-${Date.now()}` },
        ],
      }));
      showToast(`Schedule phase "${phaseData.name}" added`);
    });
  };

  const addMilestone = (milestoneData: Omit<Milestone, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        milestones: [
          ...prev.milestones,
          { ...milestoneData, id: `ms-${Date.now()}` },
        ],
      }));
      showToast(`Milestone "${milestoneData.title}" logged`);
    });
  };

  // 8. Team & RACI
  const addTeamMember = (memberData: Omit<TeamMember, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        teamMembers: [
          ...prev.teamMembers,
          { ...memberData, id: `tm-${Date.now()}` },
        ],
      }));
      showToast(`Team member "${memberData.name}" added to project`);
    });
  };

  const deleteTeamMember = (memberId: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        teamMembers: prev.teamMembers.filter((m) => m.id !== memberId),
      }));
      showToast('Team member removed from project');
    });
  };

  const addRaciDeliverable = (row: RACIRow) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        raciMatrix: [...prev.raciMatrix, row],
      }));
      showToast(`RACI deliverable "${row.deliverable}" added`);
    });
  };

  const updateRaciCell = (
    deliverableIndex: number,
    roleKey: keyof Omit<RACIRow, 'deliverable' | 'category'>,
    value: RACIRole
  ) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const matrix = [...prev.raciMatrix];
        if (matrix[deliverableIndex]) {
          matrix[deliverableIndex] = {
            ...matrix[deliverableIndex],
            [roleKey]: value,
          };
        }
        return {
          ...prev,
          raciMatrix: matrix,
        };
      });
      showToast(`RACI responsibility updated`);
    });
  };

  const deleteRaciDeliverable = (deliverableIndex: number) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => {
        const matrix = prev.raciMatrix.filter((_, idx) => idx !== deliverableIndex);
        return {
          ...prev,
          raciMatrix: matrix,
        };
      });
      showToast('RACI deliverable removed');
    });
  };

  // 9. Stakeholders & Communication
  const addStakeholder = (data: Omit<Stakeholder, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        stakeholders: [
          ...prev.stakeholders,
          { ...data, id: `stk-${Date.now()}` },
        ],
      }));
      showToast(`Stakeholder "${data.name}" added`);
    });
  };

  const deleteStakeholder = (stakeholderId: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        stakeholders: prev.stakeholders.filter((s) => s.id !== stakeholderId),
      }));
      showToast('Stakeholder removed');
    });
  };

  const addCommunicationEvent = (data: Omit<CommunicationEvent, 'id'>) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        communicationPlan: [
          ...prev.communicationPlan,
          { ...data, id: `comm-${Date.now()}` },
        ],
      }));
      showToast(`Communication event "${data.activity}" added`);
    });
  };

  const deleteCommunicationEvent = (eventId: string) => {
    requireManagerAuth(() => {
      mutateActiveProject((prev) => ({
        ...prev,
        communicationPlan: prev.communicationPlan.filter((c) => c.id !== eventId),
      }));
      showToast('Communication event removed');
    });
  };

  // 10. Reset All Data — clears everything back to a blank slate
  const resetAllData = () => {
    requireManagerAuth(() => {
      try {
        localStorage.removeItem(STORAGE_KEY_PROJECTS);
        localStorage.removeItem('pms_projects_data');
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      } catch {
        // ignore
      }
      setProjects(initialProjectsMap as Record<string, ProjectData>);
      setActiveProjectIdState('');
      setNotifications(initialNotifications);
      setCurrentView('dashboard');
      showToast('All data cleared. Start fresh by creating a new project.');
    });
  };

  // Notifications helpers
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
    showToast('Notifications cleared');
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        project,
        activeProjectId,
        setActiveProjectId,
        projectsList,
        addProject,

        currentView,
        setCurrentView,
        searchQuery,
        setSearchQuery,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        activeModal,
        openModal,
        closeModal,

        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        isNotificationsOpen,
        setIsNotificationsOpen,

        authUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        login,
        logout,
        requireManagerAuth,

        moveKanbanTask,
        addKanbanTask,

        addRisk,
        updateRiskStatus,
        deleteRisk,

        addChangeRequest,
        updateChangeStatus,

        toggleQualityCheck,
        updateIssueStatus,
        addIssue,

        addScopeItem,
        toggleObjective,

        addBudgetCategory,
        updateResourceAllocation,

        addSchedulePhase,
        addMilestone,

        addTeamMember,
        deleteTeamMember,
        addRaciDeliverable,
        updateRaciCell,
        deleteRaciDeliverable,

        addStakeholder,
        deleteStakeholder,
        addCommunicationEvent,
        deleteCommunicationEvent,

        resetAllData,

        toastMessage,
        showToast,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}

