import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createJob, 
    getJobs, 
    getJobById, 
    deleteJob, 
    updateJob } from "../controllers/jobController";
import { isCandidate,
    isEmployer
 } from "../middleware/roles";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, isEmployer, createJob);
router.patch("/:id", protect, isEmployer, updateJob);
router.delete("/:id", protect, isEmployer, deleteJob);

export default router;