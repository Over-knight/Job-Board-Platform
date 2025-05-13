import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createJob, 
    getJobs, 
    getJobById, 
    deleteJob, 
    updateJob,
    searchJobs } from "../controllers/jobController";
import { isCandidate,
    isEmployer
 } from "../middleware/roles";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.get("/search", searchJobs);
router.post("/", protect, isEmployer, createJob);
router.patch("/:id", protect, isEmployer, updateJob);
router.delete("/:id", protect, isEmployer, deleteJob);

export default router;