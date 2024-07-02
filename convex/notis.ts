import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";
import { QueryCtx, mutation, query } from "./_generated/server";

enum ACTION_TYPE {
  ACCEPT = "accept",
  DENY = "deny",
}

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
    documentId: v.id("documents"),
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

export const handleRequestPermission = mutation({
  args: {
    notiId: v.id("notis"),
    action: v.string(),
  },
  handler: async (ctx, arg) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const noti = await ctx.db.get(arg.notiId);
    if (!noti) {
      throw new Error("Not found");
    }
    const document = await ctx.db.get(noti.documentId);
    if (!document) {
      throw new Error("Not found");
    }
    if (userId !== document?.userId) {
      throw new Error("You don't have permission for this action");
    }
    if (arg.action === ACTION_TYPE.ACCEPT && noti.fromUser) {
      const newListMembers = [...(document.members ?? []), noti.fromUser];
      await ctx.db.patch(noti.documentId, {
        members: newListMembers,
      });
      await ctx.db.delete(arg.notiId);
      return;
    }
    if (arg.action === ACTION_TYPE.DENY) {
      await ctx.db.delete(arg.notiId);
      return;
    }
  },
});
