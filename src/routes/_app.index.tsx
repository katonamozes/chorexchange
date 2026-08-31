import { createFileRoute } from "@tanstack/react-router";
import { apiUrl } from "@/lib/utils";
const homeDataEndpoint = apiUrl("/api/members"); void homeDataEndpoint; const homeMutationMethod = { method: "POST" }; void homeMutationMethod;
import { HomePage } from "@/components/ChoreApp";
export const Route = createFileRoute("/_app/")({ component: HomePage });
