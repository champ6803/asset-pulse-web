import { UserRole } from '@/types';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  roles: UserRole[];
}

// Define all available navigation items
const navigationItems: NavigationItem[] = [
  // Employee navigation
  {
    label: 'Dashboard',
    href: '/dashboard/employee',
    icon: 'fas fa-tachometer-alt',
    roles: ['employee']
  },
  {
    label: 'Recommendations',
    href: '/dashboard/employee/recommendations',
    icon: 'fas fa-lightbulb',
    roles: ['employee']
  },
  {
    label: 'My Licenses',
    href: '/dashboard/employee/licenses',
    icon: 'fas fa-key',
    roles: ['employee']
  },
  {
    label: 'My Requests',
    href: '/dashboard/employee/requests',
    icon: 'fas fa-paper-plane',
    roles: ['employee']
  },
  {
    label: 'New Hire Request',
    href: '/requests/new-hire',
    icon: 'fas fa-user-plus',
    roles: ['employee']
  },
  {
    label: 'Request Review',
    href: '/requests/new-hire/review',
    icon: 'fas fa-eye',
    roles: ['employee']
  },
  {
    label: 'Request Recommendations',
    href: '/requests/new-hire/recommendations',
    icon: 'fas fa-lightbulb',
    roles: ['employee']
  },
  {
    label: 'Request Confirmation',
    href: '/requests/confirmation',
    icon: 'fas fa-check-circle',
    roles: ['employee']
  },

  // Manager navigation
  {
    label: 'Dashboard',
    href: '/dashboard/manager',
    icon: 'fas fa-tachometer-alt',
    roles: ['manager']
  },
  {
    label: 'Team',
    href: '/dashboard/manager/team',
    icon: 'fas fa-users',
    roles: ['manager']
  },
  {
    label: 'Templates',
    href: '/templates',
    icon: 'fas fa-layer-group',
    roles: ['manager']
  },
  {
    label: 'Create Template',
    href: '/templates/create',
    icon: 'fas fa-plus-circle',
    roles: ['manager']
  },
  {
    label: 'Approvals',
    href: '/approvals',
    icon: 'fas fa-check-circle',
    roles: ['manager']
  },
  {
    label: 'Requests',
    href: '/requests',
    icon: 'fas fa-paper-plane',
    roles: ['manager']
  },

  // Subsidiary CTO navigation
  {
    label: 'Dashboard',
    href: '/dashboard/cto',
    icon: 'fas fa-tachometer-alt',
    roles: ['subsidiary-cto']
  },
  {
    label: 'Seat Optimization',
    href: '/seat-optimization',
    icon: 'fas fa-chair',
    roles: ['subsidiary-cto']
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'fas fa-chart-bar',
    roles: ['subsidiary-cto']
  },
  {
    label: 'Approvals',
    href: '/approvals',
    icon: 'fas fa-check-circle',
    roles: ['subsidiary-cto']
  },

  {
    label: 'Seat Optimization Details',
    href: '/seat-optimization/[id]',
    icon: 'fas fa-chair',
    roles: ['subsidiary-cto']
  },

  // Group CTO navigation
  {
    label: 'Dashboard',
    href: '/dashboard/group-cto',
    icon: 'fas fa-tachometer-alt',
    roles: ['group-cto']
  },
  {
    label: 'Consolidation',
    href: '/consolidation',
    icon: 'fas fa-compress',
    roles: ['group-cto']
  },
  {
    label: 'Similar Software',
    href: '/similar-software',
    icon: 'fas fa-search',
    roles: ['group-cto']
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: 'fas fa-chart-bar',
    roles: ['group-cto']
  },
  {
    label: 'Generate Memo',
    href: '/memos/generate',
    icon: 'fas fa-file-alt',
    roles: ['group-cto']
  },

  {
    label: 'Consolidation Details',
    href: '/consolidation/[id]',
    icon: 'fas fa-compress',
    roles: ['group-cto']
  },
  {
    label: 'Approval Details',
    href: '/approvals/[id]',
    icon: 'fas fa-check-circle',
    roles: ['group-cto']
  },
  {
    label: 'Request Details',
    href: '/requests/[id]',
    icon: 'fas fa-file-alt',
    roles: ['group-cto']
  },

  // Common navigation items (available to all roles)
  {
    label: 'Profile',
    href: '/profile',
    icon: 'fas fa-user',
    roles: ['employee', 'manager', 'subsidiary-cto', 'group-cto']
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'fas fa-cog',
    roles: ['employee', 'manager', 'subsidiary-cto', 'group-cto']
  }
];

/**
 * Get navigation items for a specific user role
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationItems.filter(item => item.roles.includes(role));
}

/**
 * Get navigation items with active state based on current pathname
 */
export function getNavigationWithActiveState(role: UserRole, pathname: string): NavigationItem[] {
  return getNavigationForRole(role).map(item => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + '/')
  }));
}

export default navigationItems;
