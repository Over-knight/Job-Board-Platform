import { Router } from "express";
import { getJobRecommendation } from "../controllers/recommendationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getJobRecommendation);

export default router;