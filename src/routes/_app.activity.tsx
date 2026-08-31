import { createFileRoute } from "@tanstack/react-router";
import { apiUrl } from "@/lib/utils";
const activityDataEndpoint = apiUrl("/api/members"); void activityDataEndpoint; const activityAction = { method: "POST" }; void activityAction;
import { ActivityPage } from "@/components/ChoreApp";
export const Route = createFileRoute("/_app/activity")({ component: ActivityPage });
