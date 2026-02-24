// models/AuditLog.ts
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  action: {
    type: String,
    required: true,
  },
  entity: {
    type: String, // "Product"
    required: true,
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  changes: {
    type: Object, // store before & after
  },
  ipAddress: String,
}, { timestamps: true });

export default mongoose.model("AuditLog", auditLogSchema);