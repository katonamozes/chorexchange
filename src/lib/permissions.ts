// Permission union is defined locally for the app's business actions.
import { ROLE_METADATA } from "./role-metadata";

export const ADMIN_ROLE = "admin";
export const ACTIONS = ["manage_system", "browse_chores", "post_chore", "manage_exchange"] as const;
export type Action = (typeof ACTIONS)[number];
export type RoleInput = string | readonly string[] | null | undefined;

export const PERMISSION_MATRIX: Record<string, Action[]> = {
  [ADMIN_ROLE]: [...ACTIONS],
  chore_member: ["browse_chores", "post_chore", "manage_exchange"],
};

export const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(ROLE_METADATA).map(([key, metadata]) => [key, metadata.label]),
);
export function getDefaultRouteForRole(role: string) { return ROLE_METADATA[role as keyof typeof ROLE_METADATA]?.defaultRoute ?? "/"; }
export function toRoleList(roles: RoleInput): string[] { const values = typeof roles === "string" ? [roles] : (roles ?? []); return [...new Set(values.map((r) => r.trim()).filter(Boolean))]; }
export function hasAnyRole(assignedRoles: RoleInput, requiredRoles: readonly string[]): boolean { return requiredRoles.length === 0 || requiredRoles.some((r) => toRoleList(assignedRoles).includes(r)); }
export function can(roles: RoleInput, action: Action): boolean { return toRoleList(roles).some((role) => PERMISSION_MATRIX[role]?.includes(action)); }
export function getEffectiveActions(roles: RoleInput): Action[] { return ACTIONS.filter((action) => can(roles, action)); }
