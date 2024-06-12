import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { internalMutation, internalQuery, QueryCtx } from "./_generated/server";
import { UserJSON } from "@clerk/backend";

export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", args.subject))
      .unique();
  },
});

export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await userQuery(ctx, clerkUser.id);

    if (userRecord === null) {
      const colors = ["red", "green", "blue"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      await ctx.db.insert("users", { clerkUser, color });
    } else {
      await ctx.db.patch(userRecord._id, { clerkUser });
    }
  },
});

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(ctx, id);

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(userRecord._id);
    }
  },
});

export async function userQuery(
    ctx: QueryCtx,
    clerkUserId: string
  ): Promise<(Omit<Doc<"users">, "clerkUser"> & { clerkUser: UserJSON }) | null> {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUserId))
      .unique();
  }
  