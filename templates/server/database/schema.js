const schema = {
  Posts: {
    columns: {
      title: [{ type: "string", required: true }],
      body: [{ type: "string" }],
      created_at: [{ type: "date", default: "date.now" }],
      updated_at: { type: "date", default: "date.now" }
    }
  },
  Comments: {
    userId: { type: "foreign_key", table: "users" },
    body: { type: "string" },
    likes: { type: "number" },
    created_at: { type: "date", default: "date.now" },
    updated_at: { type: "date", default: "date.now" }
  }
};

module.exports = schema;
