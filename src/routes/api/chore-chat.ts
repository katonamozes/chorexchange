import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { withErrors } from "@/lib/route-handlers";
import { requireAuth } from "@/lib/auth";
import { listChoreMessages, sendChoreMessage } from "@/services/chores";

const messageSchema = z.object({ choreId: z.string().min(1), body: z.string().trim().min(1).max(2000) });

export const Route = createFileRoute("/api/chore-chat")({ server: { handlers: {
  GET: withErrors(async ({ request }) => { const user = await requireAuth("admin", "chore_member"); const choreId = new URL(request.url).searchParams.get("choreId"); return Response.json(await listChoreMessages(z.string().min(1).parse(choreId), user.id)); }),
  POST: withErrors(async ({ request }) => { const user = await requireAuth("admin", "chore_member"); const body = messageSchema.parse(await request.json()); return Response.json(await sendChoreMessage(body.choreId, user.id, body.body), { status: 201 }); }),
} } });
