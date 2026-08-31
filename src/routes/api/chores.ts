import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { withErrors } from "@/lib/route-handlers";
import { requireAuth } from "@/lib/auth";
import { can } from "@/lib/permissions";
import { claimChore, completeChore, createChore, listChores, updateChore } from "@/services/chores";

const createSchema = z.object({ title: z.string().trim().min(1), category: z.string().min(1), neighborhood: z.string().trim().min(1), timing: z.string().trim().min(1), details: z.string().optional(), credits: z.coerce.number().int().positive() });
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("claim"), id: z.string().min(1) }),
  z.object({ action: z.literal("complete"), id: z.string().min(1) }),
  z.object({ action: z.literal("update"), id: z.string().min(1), title: z.string().trim().min(1), category: z.string().min(1), neighborhood: z.string().trim().min(1), timing: z.string().trim().min(1), details: z.string().optional(), credits: z.coerce.number().int().positive() }),
]);

export const Route = createFileRoute("/api/chores")({ server: { handlers: {
  GET: withErrors(async ({ request }) => { await requireAuth(); const category = new URL(request.url).searchParams.get("category") ?? undefined; return Response.json(await listChores(category)); }),
  POST: withErrors(async ({ request }) => { const user = await requireAuth("admin", "chore_member"); const raw = await request.json(); if (raw && typeof raw === "object" && "action" in raw) { const action = actionSchema.parse(raw); const isAdmin = can(user.roles, "manage_system"); if (action.action === "claim") return Response.json(await claimChore(action.id, user.id, isAdmin)); if (action.action === "complete") return Response.json(await completeChore(action.id, user.id)); return Response.json(await updateChore(action.id, user.id, action, isAdmin)); } const body = createSchema.parse(raw); return Response.json(await createChore({ ...body, id: crypto.randomUUID(), postedBy: user.id }), { status: 201 }); }),
} } });
