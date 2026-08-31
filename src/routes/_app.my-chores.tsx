import { createFileRoute } from "@tanstack/react-router";
import { apiUrl } from "@/lib/utils";
import { can } from "@/lib/permissions";
import type { AppUser } from "@/lib/users";
const choresDataEndpoint = apiUrl("/api/members"); void choresDataEndpoint; const choresMutationMethod = { method: "POST" }; void choresMutationMethod;
import { MyChoresPage } from "@/components/ChoreApp";

export const Route = createFileRoute("/_app/my-chores")({ component: MyChoresRoute });
function MyChoresRoute() { const user = Route.useRouteContext().user as AppUser; return <MyChoresPage isAdmin={can(user.roles, "manage_system")} />; }
