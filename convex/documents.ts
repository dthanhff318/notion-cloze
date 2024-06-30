import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

const checkAuth = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }
  return identity;
};

const queryInfoUserLastEdit = async (
  ctx: QueryCtx,
  documents: Doc<"documents">[]
) => {
  // Get info user last edit
  const users = documents
    .filter((doc) => !!doc.lastEdited)
    .map((doc) =>
      ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) =>
          q.eq("clerkId", doc.lastEdited?.user ?? "")
        )
        .unique()
    );
  let infoUser: (Doc<"users"> | null)[] = [];
  await Promise.all(users).then((res) => {
    infoUser = res;
  });
  const results = documents.map((e) => {
    if (e.lastEdited?.user) {
      const user = infoUser.find((x) => x?.clerkId === e.lastEdited?.user);
      return {
        ...e,
        lastEdited: { ...e.lastEdited, user },
      };
    }
    return e;
  });
  return results;
};

export const archive = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveArchived = async (documenId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documenId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });
        await recursiveArchived(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });
    recursiveArchived(args.id);

    return document;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });
    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    const results = queryInfoUserLastEdit(ctx, documents);
    return results;
  },
});

export const getFavouriteDocs = query({
  handler: async (ctx) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isFavourite"), true))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    const results = queryInfoUserLastEdit(ctx, documents);
    return results;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();
    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const recursiveRestore = async (documenId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documenId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false,
        });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };
    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    const doc = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);
    return doc;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.delete(args.id);
    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();
    return documents;
  },
});

export const getById = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Not found");
    }
    if (document.isPublished && !document.isArchived) {
      return document;
    }
    if (!document.isPublished && userId !== document.userId) {
      if (!document.members?.includes(userId)) {
        return {
          ...document,
          status: 403,
        };
      }
    }

    if (document.userId !== userId) {
      throw new Error("Unauthorized");
    }
    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    isFavourite: v.optional(v.boolean()),
    allowEdit: v.optional(v.boolean()),
    lastEdited: v.optional(
      v.object({
        user: v.string(),
        time: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const { id, ...rest } = args;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }
    const document = await ctx.db.patch(id, { ...rest });
    return document;
  },
});

export const removeIcon = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      icon: undefined,
    });
    return document;
  },
});

export const removeCoverImage = mutation({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await checkAuth(ctx);
    const userId = identity.subject;
    const existingDocument = await ctx.db.get(args.id);
    if (!existingDocument) {
      throw new Error("Not found");
    }
    if (existingDocument.userId !== userId) {
      throw new Error("Unauthorized");
    }

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined,
    });
    return document;
  },
});

export const getPreviewById = query({
  args: {
    id: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const document = await ctx.db.get(args.id);
    if (!document) {
      throw new Error("Not found");
    }
    if (!document.isPublished) {
      const identity = await checkAuth(ctx);
      const userId = identity.subject;
      if (!document.members?.includes(userId)) {
        return {
          ...document,
          status: 403,
        };
      }
    }

    if (document.isPublished && !document.isArchived) {
      return document;
    }

    throw new Error("Not foundzz");
  },
});

export const getLastEdited = query({
  args: {
    docId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    await checkAuth(ctx);
    const document = await ctx.db.get(args.docId);
    if (!document) {
      throw new Error("Not found");
    }
    if (document.lastEdited?.user) {
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) =>
          q.eq("clerkId", document.lastEdited?.user ?? "")
        )
        .unique();
      return user;
    }
    return null;
  },
});
