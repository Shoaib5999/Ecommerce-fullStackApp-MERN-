// utils/auditLogger.ts
import AuditLog from "../models/auditLogs.js";

export const logAction = async ({
  userId,
  action,
  entity,
  entityId,
  changes,
  ipAddress,
}) => {
  try {
    await AuditLog.create({
      userId,
      action,
      entity,
      entityId,
      changes,
      ipAddress,
    });
  } catch (error) {
    console.error("Audit log failed:", error);
  }
};
