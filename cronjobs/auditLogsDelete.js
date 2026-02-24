import cron from 'node-cron';
import AuditLog from '../models/auditLogs.js';

function auditLogsDelete() {
  cron.schedule("0 2 * * *", async () => {
    try {
      console.log("Deleting logs older than 7 days");

    const result = await AuditLog.deleteMany({
      createdAt: {
        $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    });

    console.log(`${result.deletedCount} logs deleted`);
  } catch (err) {
    console.error("Error deleting logs:", err);
  }
},{timezone:"Asia/Kolkata"});}

export default auditLogsDelete;