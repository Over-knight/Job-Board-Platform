import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { createJob, 
    getJobs, 
    getJobById, 
    deleteJob, 
    updateJob } from "../controllers/jobController";

const router = Router();

router.get("/", getJobs);
router.get("/:id", getJobById);
router.post("/", protect, createJob);
router.patch("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

export default router;