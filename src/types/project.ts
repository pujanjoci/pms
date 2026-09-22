export type Priority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type Status = 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Pending';

export interface ProjectObjective {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  targetMetric: string;
}

export interface ScopeItem {
  id: string;
  title: string;
  category: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Planned';
}

export interface OutOfScopeItem {
  id: string;
  title: string;
  reason: string;
}

export interface SchedulePhase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  lead: string;
  durationWeeks: number;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  status: 'Completed' | 'In Progress' | 'Pending';
  description: string;
  owner: string;
  completionDate?: string;
}

export interface TaskDependency {
  id: string;
  from: string;
  to: string;
  type: 'Finish-to-Start' | 'Start-to-Start';
  status: 'Resolved' | 'Active' | 'Critical';
  delayDays?: number;
}

export interface BudgetCategory {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  variance: number;
  color: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  allocation: number; // percentage
  workloadStatus: 'Optimal' | 'High' | 'Overallocated';
  activeTasks: number;
  completedTasks: number;
  email: string;
  department: string;
}

export interface RiskItem {
  id: string;
  code: string;
  title: string;
  category: 'Technical' | 'Schedule' | 'Budget' | 'Operational' | 'External';
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  riskScore: number; // 1-25 or calculated
  owner: string;
  status: 'Monitoring' | 'Open' | 'Mitigated' | 'Closed';
  action: string;
  dateLogged: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  interest: 'High' | 'Medium' | 'Low';
  influence: 'High' | 'Medium' | 'Low';
  communicationFreq: string;
  engagementStatus: 'Champion' | 'Supportive' | 'Neutral' | 'Requires Attention';
  contact: string;
}

export interface CommunicationEvent {
  id: string;
  activity: string;
  audience: string;
  frequency: string;
  channel: string;
  owner: string;
  deliverable: string;
}

export interface QualityCheckItem {
  id: string;
  item: string;
  category: string;
  passed: boolean;
  inspector: string;
  lastChecked: string;
}

export interface QualityMetrics {
  testsCompleted: number;
  totalTests: number;
  testsPassedPercent: number;
  openBugs: number;
  criticalBugs: number;
  qaCompletionPercent: number;
}

export interface IssueItem {
  id: string;
  code: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  assignedTo: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  dueDate: string;
  category: string;
}

export interface ChangeRequest {
  id: string;
  code: string;
  title: string;
  requestedBy: string;
  impactDays: number;
  impactCost: number;
  status: 'Pending Approval' | 'Approved' | 'Rejected' | 'Under Review';
  description: string;
  dateRequested: string;
  justification: string;
}

export type RACIRole = 'R' | 'A' | 'C' | 'I' | '-';

export interface RACIRow {
  deliverable: string;
  category: string;
  pm: RACIRole;
  designer: RACIRole;
  frontendDev: RACIRole;
  backendDev: RACIRole;
  qa: RACIRole;
  client: RACIRole;
}

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  column: 'todo' | 'in_progress' | 'in_review' | 'done';
  priority: Priority;
  assigneeId: string;
  dueDate: string;
  tags: string[];
  estimatedHours: number;
  loggedHours: number;
}

export interface ManagementInsight {
  category: 'Schedule' | 'Budget' | 'Quality' | 'Resources';
  headline: string;
  detail: string;
  status: 'healthy' | 'warning' | 'critical' | 'info';
  metric: string;
}

export interface FinalRecommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Strategic';
  title: string;
  action: string;
  owner: string;
  timeline: string;
  impact: string;
}

export interface ProjectData {
  id: string;
  name: string;
  code: string;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  health: {
    overall: 'On Track' | 'At Risk' | 'Delayed';
    schedule: 'On Track' | 'At Risk' | 'Delayed';
    budget: 'Healthy' | 'At Risk' | 'Critical';
    quality: 'Healthy' | 'Warning' | 'Critical';
    resources: 'On Track' | 'High Load' | 'Critical';
  };
  projectManager: string;
  projectSponsor: string;
  startDate: string;
  targetDate: string;
  progress: number;
  totalBudget: number;
  spentBudget: number;
  remainingBudget: number;
  budgetVariancePercent: number;
  scheduleVarianceDays: number;
  description: string;
  businessNeed: string;
  projectPurpose: string;
  developmentApproach: string;
  objectives: ProjectObjective[];
  scope: {
    inScope: ScopeItem[];
    outOfScope: OutOfScopeItem[];
  };
  schedulePhases: SchedulePhase[];
  milestones: Milestone[];
  dependencies: TaskDependency[];
  budgetBreakdown: BudgetCategory[];
  teamMembers: TeamMember[];
  risks: RiskItem[];
  stakeholders: Stakeholder[];
  communicationPlan: CommunicationEvent[];
  qualityChecklist: QualityCheckItem[];
  qualityMetrics: QualityMetrics;
  issues: IssueItem[];
  changeRequests: ChangeRequest[];
  raciMatrix: RACIRow[];
  kanbanTasks: KanbanTask[];
  insights: ManagementInsight[];
  keyFindings: string[];
  recommendations: FinalRecommendation[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'success' | 'info' | 'warning';
  read: boolean;
}

export interface ProjectSummary {
  id: string;
  name: string;
  code: string;
  status: 'On Track' | 'At Risk' | 'Delayed' | 'Completed';
  progress: number;
  badge?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  role: string;
  email: string;
  isManager: boolean;
}
