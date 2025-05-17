import ApiResponse from "../utils/apiResponse.js";
import AuditLog from "../schemas/auditlog.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const history = await AuditLog.find()
      .sort({ timestamp: -1 }) 
      .populate("user", "username")
      .populate("task", "title");

    res.json(new ApiResponse(true, history, "Audit log fetched successfully"));
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json(new ApiResponse(false, {}, "Something went wrong"));
  }
};
