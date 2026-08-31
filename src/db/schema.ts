import { pgEnum, pgSchema, pgTable, text, integer, boolean, timestamp, index, type PgSchema } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";

type AppSchema = Pick<PgSchema<string>, "table" | "enum">;
const dbSchemaName = process.env.DB_SCHEMA?.trim();
export const appSchema: AppSchema = dbSchemaName
  ? pgSchema(dbSchemaName)
  : ({ table: pgTable, enum: pgEnum } as unknown as AppSchema);

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdateFn(() => new Date()),
};

export const members = appSchema.table("chore_members", {
  id: text("id").primaryKey(), displayName: text("display_name").notNull(), neighborhood: text("neighborhood").notNull(),
  credits: integer("credits").notNull().default(0), welcomeGrant: boolean("welcome_grant").notNull().default(false), ...timestamps,
}, (table) => ({ createdIdx: index("chore_members_created_idx").on(table.createdAt) }));
export const chores = appSchema.table("chore_offers", {
  id: text("id").primaryKey(), title: text("title").notNull(), category: text("category").notNull(), neighborhood: text("neighborhood").notNull(), timing: text("timing").notNull(), details: text("details"), credits: integer("credits").notNull(), postedBy: text("posted_by").notNull(), claimedBy: text("claimed_by"), status: text("status").notNull().default("open"), ...timestamps,
}, (table) => ({ statusIdx: index("chore_offers_status_idx").on(table.status) }));
export const creditEvents = appSchema.table("chore_credit_events", {
  id: text("id").primaryKey(), memberId: text("member_id").notNull(), choreId: text("chore_id"), kind: text("kind").notNull(), amount: integer("amount").notNull(), note: text("note").notNull(), ...timestamps,
}, (table) => ({ memberIdx: index("chore_credit_events_member_idx").on(table.memberId, table.createdAt) }));
export const choreMessages = appSchema.table("chore_messages", {
  id: text("id").primaryKey(), choreId: text("chore_id").notNull(), senderId: text("sender_id").notNull(), body: text("body").notNull(), ...timestamps,
}, (table) => ({ choreIdx: index("chore_messages_chore_idx").on(table.choreId, table.createdAt), senderIdx: index("chore_messages_sender_idx").on(table.senderId) }));
export const insertMemberSchema = createInsertSchema(members); export const selectMemberSchema = createSelectSchema(members); export const updateMemberSchema = createUpdateSchema(members);
export const insertChoreSchema = createInsertSchema(chores); export const selectChoreSchema = createSelectSchema(chores); export const insertCreditEventSchema = createInsertSchema(creditEvents); export const insertChoreMessageSchema = createInsertSchema(choreMessages); export const selectChoreMessageSchema = createSelectSchema(choreMessages);
export type Member = typeof members.$inferSelect; export type Chore = typeof chores.$inferSelect; export type CreditEvent = typeof creditEvents.$inferSelect; export type ChoreMessage = typeof choreMessages.$inferSelect;
