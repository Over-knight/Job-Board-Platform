import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { applyToJob,
    getJobApplications,
    getMyApplications
 } from "../controllers/applicationController";

 const router = Router();

 router.post("/jobs/:jobId/apply", protect, applyToJob);
 router.get("/jobs/:jobId", protect, getJobApplications);
 router.get("/me", protect, getMyApplications);
 export default router