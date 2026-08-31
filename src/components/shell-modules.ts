import type { ElementType } from "react";
import { Home, Compass, PlusCircle, HandCoins, History } from "lucide-react";
import { can, type Action, type RoleInput } from "@/lib/permissions";
export interface NavModule { key: string; label: string; href?: string; icon?: ElementType; actions?: Action[]; children?: NavModule[]; badge?: string; locked?: boolean; disabledReason?: string; }
export interface NavigationLeaf { key: string; label: string; href: string; }
function normalizeNavigationHref(href: string) { return href === "/" ? href : href.replace(/\/+$/, ""); }
export function validateNavigationModules(modules: readonly NavModule[]): NavigationLeaf[] {
  const keys = new Set<string>(); const hrefs = new Map<string, string>(); const leaves: NavigationLeaf[] = []; const errors: string[] = [];
  function visit(items: readonly NavModule[]) { for (const module of items) { if (keys.has(module.key)) errors.push(`Duplicate key ${module.key}`); keys.add(module.key); if (module.children?.length) visit(module.children); else if (!module.href) errors.push(`${module.key}: clickable leaf requires href`); else { const href = normalizeNavigationHref(module.href); const previous = hrefs.get(href); if (previous) errors.push(`href "${href}" is already used by ${previous}`); hrefs.set(href, module.label); leaves.push({ key: module.key, label: module.label, href }); } } }
  visit(modules); if (errors.length) throw new Error(`Invalid sidebar navigation: ${errors.join(", ")}`); return leaves;
}
export function defineNavigationModules(modules: NavModule[]) { validateNavigationModules(modules); return modules; }
export const defaultModules = defineNavigationModules([
  { key: "home", label: "Home", href: "/", icon: Home },
  { key: "discover", label: "Discover chores", href: "/discover", icon: Compass, actions: ["browse_chores"] },
  { key: "my-chores", label: "My chores", href: "/my-chores", icon: HandCoins, actions: ["manage_exchange"] },
  { key: "activity", label: "Credit activity", href: "/activity", icon: History, actions: ["browse_chores"] },
  { key: "post", label: "Post a chore", href: "/post", icon: PlusCircle, actions: ["post_chore"] },
]);
export function getModuleActions(module: NavModule): Action[] { return module.actions ?? []; }
export function canViewModule(roles: RoleInput, module: NavModule) { const actions = getModuleActions(module); return !actions.length || actions.every((action) => can(roles, action)); }
export function filterVisibleModules(modules: NavModule[], roles: RoleInput): NavModule[] { return modules.flatMap((m) => { const children = m.children ? filterVisibleModules(m.children, roles) : undefined; const visible = canViewModule(roles, m); if (!visible && !children?.length) return []; if (children !== undefined) return children.length ? [{ ...m, children }] : []; return visible ? [m] : []; }); }
