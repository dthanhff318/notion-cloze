import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Document
  documents: defineTable({
    title: v.string(),
    userId: v.string(),
    isArchived: v.boolean(),
    parentDocument: v.optional(v.id("documents")),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.boolean(),
    isFavourite: v.optional(v.boolean()),
    allowEdit: v.optional(v.boolean()),
    lastEdited: v.optional(
      v.object({
        user: v.string(),
        time: v.number(),
      })
    ),
    members: v.optional(v.array(v.string())),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  // User
  users: defineTable({
    clerkId: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_clerk_id", ["clerkId"]),
  // Noti
  notis: defineTable({
    userId: v.string(),
    type: v.string(),
    fromUser: v.optional(v.string()),
    documentId: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_fromUser", ["fromUser"]),
});
