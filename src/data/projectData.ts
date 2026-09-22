import { NotificationItem, ProjectSummary } from '@/types/project';

// No pre-loaded project — all data is created by the user at runtime.
export const initialProjectsMap: Record<string, never> = {};

export const sampleProjectsSummary: ProjectSummary[] = [];

export const initialNotifications: NotificationItem[] = [];
