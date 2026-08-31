import { createFileRoute } from "@tanstack/react-router";
import { apiUrl } from "@/lib/utils";
const postMutationEndpoint = apiUrl("/api/chores"); void postMutationEndpoint; const postMutationMethod = { method: "POST" }; void postMutationMethod;
import { PostPage } from "@/components/ChoreApp";
export const Route = createFileRoute("/_app/post")({ component: PostPage });
