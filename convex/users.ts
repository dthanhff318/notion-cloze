import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";

export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args) {
    return ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.subject))
      .unique();
  },
});

export const updateOrCreateUser = mutation({
  args: { clerkUser: v.any() }, // no runtime validation, trust Clerk
  handler: async (ctx, args) => {
    const { clerkUser } = args;
    const userRecord = await userQuery(clerkUser.clerkId, ctx);
    if (!userRecord) {
      await ctx.db.insert("users", clerkUser);
    } else {
      await ctx.db.patch(userRecord._id, clerkUser);
    }
  },
});

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await userQuery(id, ctx);
    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(userRecord._id);
    }
  },
});

export const userQuery = async (id: string, ctx: QueryCtx) => {
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", id))
    .unique();
};

export const getUsers = query({
  args: {
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_email", (q) =>
        q.search("email", args.email ?? "")
      )
      .collect();

    return users;
  },
});
