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
    lastEdited: v.optional(
      v.object({
        user: v.string(),
        time: v.number(),
      })
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_parent", ["userId", "parentDocument"]),
  // User
  users: defineTable({
    clerkUser: v.any(),
    color: v.string(),
  }).index("by_clerk_id", ["clerkUser.id"]),
});
