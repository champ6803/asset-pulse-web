import { UserRole } from "@/types";

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  roles: UserRole[];
}

// Define all available navigation items based on SITEMAP
const navigationItems: NavigationItem[] = [
  // Employee navigation
  {
    label: "Dashboard",
    href: "/dashboard/employee",
    icon: "fas fa-home",
    roles: ["employee"],
  },
  {
    label: "My Licenses",
    href: "/dashboard/employee/licenses",
    icon: "fas fa-key",
    roles: ["employee"],
  },
  {
    label: "My Requests",
    href: "/dashboard/employee/requests",
    icon: "fas fa-paper-plane",
    roles: ["employee"],
  },
  {
    label: "New Request",
    href: "/requests/new-hire",
    icon: "fas fa-user-plus",
    roles: ["employee"],
  },

  // Manager navigation
  {
    label: "Dashboard",
    href: "/dashboard/manager",
    icon: "fas fa-home",
    roles: ["manager"],
  },
  {
    label: "Templates",
    href: "/templates",
    icon: "fas fa-layer-group",
    roles: ["manager"],
  },
  {
    label: "Approvals",
    href: "/approvals",
    icon: "fas fa-check-circle",
    roles: ["manager"],
  },

  // Subsidiary CTO navigation
  {
    label: "Dashboard",
    href: "/dashboard/cto",
    icon: "fas fa-home",
    roles: ["subsidiary-cto"],
  },
  {
    label: "Seat Optimization",
    href: "/seat-optimization",
    icon: "fas fa-chair",
    roles: ["subsidiary-cto"],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: "fas fa-chart-bar",
    roles: ["subsidiary-cto"],
  },
  {
    label: "Approvals",
    href: "/approvals",
    icon: "fas fa-check-circle",
    roles: ["subsidiary-cto"],
  },

  // Group CTO navigation
  {
    label: "Dashboard",
    href: "/dashboard/group-cto",
    icon: "fas fa-home",
    roles: ["group-cto"],
  },
  {
    label: "Similar Software",
    href: "/similar-software",
    icon: "fas fa-search",
    roles: ["group-cto"],
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: "fas fa-chart-line",
    roles: ["group-cto"],
  },
  {
    label: "AI Memo",
    href: "/memos/generate",
    icon: "fas fa-file-alt",
    roles: ["group-cto"],
  },
];

/**
 * Get navigation items for a specific user role
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return navigationItems.filter((item) => item.roles.includes(role));
}

/**
 * Get navigation items with active state based on current pathname
 */
export function getNavigationWithActiveState(
  role: UserRole,
  pathname: string
): NavigationItem[] {
  return getNavigationForRole(role).map((item) => ({
    ...item,
    active: pathname === item.href || pathname.startsWith(item.href + "/"),
  }));
}

export default navigationItems;
