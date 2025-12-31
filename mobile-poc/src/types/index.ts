/**
 * Type definitions for Inspection App PoC
 */

export type SeverityLevel = 'Normal' | 'Warning' | 'Progressed' | 'Critical';

export interface ChecklistItem {
  id: string;
  title: string;
  isCompleted: boolean;
  hasIssue: boolean;
  keywords: string[];
  severityLevels: SeverityLevel[];
}

export interface InspectionRecord {
  itemId: string;
  selectedKeywords: string[];
  severityLevel: SeverityLevel | null;
  generatedComment: string;
  inputMode: 'quick' | 'voice';
}

export const SEVERITY_COLORS: Record<SeverityLevel, string> = {
  Normal: '#4CAF50',      // Green
  Warning: '#FFC107',     // Yellow
  Progressed: '#FF9800',  // Orange/Maroon
  Critical: '#F44336',    // Red
};
