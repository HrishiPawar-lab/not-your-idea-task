import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { getAuditLogs } from "../controllers/audit.js";

const router = Router();

router.get("/", authenticate, getAuditLogs);

export default router;
