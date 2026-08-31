import { createFileRoute } from "@tanstack/react-router";
import { withErrors } from "@/lib/route-handlers";
import { requireAuth } from "@/lib/auth";
import { getDashboard, createMember } from "@/services/chores";

export const Route = createFileRoute("/api/members")({ server: { handlers: {
  GET: withErrors(async () => { const user = await requireAuth(); return Response.json(await getDashboard(user.id)); }),
  POST: withErrors(async ({ request }) => { const user = await requireAuth(); const body = await request.json() as { displayName?: string; neighborhood?: string }; if (!body.displayName?.trim() || !body.neighborhood?.trim()) return Response.json({ error: "Name and neighborhood are required" }, { status: 400 }); return Response.json(await createMember(user.id, body.displayName.trim(), body.neighborhood.trim())); }),
} } });
