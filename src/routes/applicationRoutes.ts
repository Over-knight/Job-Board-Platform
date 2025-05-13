import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { applyToJob,
    getJobApplications,
    getMyApplications
 } from "../controllers/applicationController";
import { isEmployer,
    isCandidate
 } from "../middleware/roles";

 const router = Router();

 router.post("/jobs/:jobId", protect, isCandidate, applyToJob);
 router.get("/jobs/:jobId", protect, isEmployer, getJobApplications);
 router.get("/me", protect, isCandidate, getMyApplications);
 export default router