import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";

const checkAuth = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
};

export const createNotis = mutation({
  args: {
    fromUser: v.optional(v.string()),
    type: v.string(),
    documentId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const noti = await ctx.db.insert("notis", { ...args, userId });
    return noti;
  },
});

export const getNotis = query({
  handler: async (ctx) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;

    const notis = await ctx.db
      .query("notis")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
    const extractNotis = await Promise.all(
      notis.map((noti) => extractNotiData(ctx, noti))
    );
    console.log(extractNotis);

    return extractNotis;
  },
});

const extractNotiData = async (ctx: QueryCtx, data: Doc<"notis">) => {
  const document = await ctx.db.get(data.documentId as Id<"documents">);
  return {
    ...data,
    document,
  };
};
