/**
 * Mock data for Gearbox Inspection Checklist
 * Based on the screenshot provided
 */

import { ChecklistItem } from '../types';

export const MOCK_CHECKLIST: ChecklistItem[] = [
  {
    id: '1',
    title: 'Gearbox make, model',
    isCompleted: false,
    hasIssue: true,
    keywords: ['Manufacturer plate', 'Model number', 'Identification'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '2',
    title: 'Gearbox serial number',
    isCompleted: true,
    hasIssue: false,
    keywords: ['Serial plate', 'Legible', 'Visible'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '3',
    title: 'Lubrication sticker',
    isCompleted: false,
    hasIssue: true,
    keywords: ['Sticker present', 'Legible', 'Oil type'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '4',
    title: 'Gear Oil level',
    isCompleted: false,
    hasIssue: true,
    keywords: ['Oil level', 'Sight glass', 'Low level'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '5',
    title: 'Gearbox housing',
    isCompleted: false,
    hasIssue: true,
    keywords: ['Cracks', 'Corrosion', 'Oil leak'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '6',
    title: 'HSS and rotating hydraulic unit',
    isCompleted: true,
    hasIssue: false,
    keywords: ['Rotation', 'Noise', 'Vibration'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '7',
    title: 'Brake disc and pads',
    isCompleted: true,
    hasIssue: false,
    keywords: ['Wear', 'Thickness', 'Surface condition'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
  {
    id: '8',
    title: 'HS Coupling',
    isCompleted: true,
    hasIssue: false,
    keywords: ['Alignment', 'Bolts', 'Coupling condition'],
    severityLevels: ['Normal', 'Warning', 'Progressed', 'Critical'],
  },
];

// Comment templates for quick mode generation
export const COMMENT_TEMPLATES: Record<string, string> = {
  'Cracks_Normal': 'Gearbox housing inspected. No visible cracks or defects observed. Condition: Normal.',
  'Cracks_Warning': 'Gearbox housing shows minor surface cracks. Monitoring recommended. Condition: Warning.',
  'Cracks_Progressed': 'Gearbox housing exhibits progressed cracking. Repair should be scheduled. Condition: Progressed.',
  'Cracks_Critical': 'Gearbox housing has critical structural cracks. Immediate action required. Condition: Critical.',

  'Corrosion_Normal': 'Gearbox housing surface condition is good. No corrosion observed. Condition: Normal.',
  'Corrosion_Warning': 'Light surface corrosion detected on gearbox housing. Monitor for progression. Condition: Warning.',
  'Corrosion_Progressed': 'Moderate corrosion present on gearbox housing. Surface treatment required. Condition: Progressed.',
  'Corrosion_Critical': 'Severe corrosion compromising housing integrity. Immediate replacement required. Condition: Critical.',

  'Oil leak_Normal': 'No oil leakage detected. All seals intact. Condition: Normal.',
  'Oil leak_Warning': 'Minor oil seepage observed at gasket. Monitor for worsening. Condition: Warning.',
  'Oil leak_Progressed': 'Active oil leak detected. Gasket replacement recommended. Condition: Progressed.',
  'Oil leak_Critical': 'Major oil leak present. Risk of oil loss and contamination. Immediate repair required. Condition: Critical.',
};
