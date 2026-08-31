import { createFileRoute } from "@tanstack/react-router";
import { apiUrl } from "@/lib/utils";
const discoverDataEndpoint = apiUrl("/api/chores"); void discoverDataEndpoint; const discoverMutationMethod = { method: "POST" }; void discoverMutationMethod;
import { DiscoverPage } from "@/components/ChoreApp";
export const Route = createFileRoute("/_app/discover")({ component: DiscoverPage });
