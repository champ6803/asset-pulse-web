// Mock data for development and testing

export const mockUsers = {
  'employee@scb.com': {
    id: '1',
    username: 'employee@scb.com',
    email: 'employee@scb.com',
    displayName: 'Sarah Chen',
    companyCode: 'SCB',
    departmentCode: 'Marketing',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
  },
  'manager@scb.com': {
    id: '2',
    username: 'manager@scb.com',
    email: 'manager@scb.com',
    displayName: 'Michael Torres',
    companyCode: 'SCB',
    departmentCode: 'IT',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
  },
  'cto@scb.com': {
    id: '3',
    username: 'cto@scb.com',
    email: 'cto@scb.com',
    displayName: 'David Kim',
    companyCode: 'SCBX',
    departmentCode: 'Executive',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg',
  },
};

export const departments = [
  { value: '', label: 'Select department' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
];

export const companies = [
  { value: '', label: 'Select company' },
  { value: 'scbx', label: 'SCBX Group' },
  { value: 'scb', label: 'Siam Commercial Bank' },
  { value: 'scb-tech', label: 'SCB TechX' },
  { value: 'scb-securities', label: 'SCB Securities' },
  { value: 'scb-asset', label: 'SCB Asset Management' },
  { value: 'scb-life', label: 'SCB Life Assurance' },
  { value: 'datax', label: 'SCB Data X' },
  { value: 'invx', label: 'INVX' },
];

export const appCategories = [
  'DevOps',
  'Collaboration',
  'Design',
  'Analytics',
  'Security',
  'Database',
  'Communication',
  'Project Management',
  'Creative',
];

export const licenseTiers = [
  'Free',
  'Basic',
  'Standard',
  'Pro',
  'Professional',
  'Business',
  'Enterprise',
  'Team',
  'Creator',
];

