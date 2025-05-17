import express from "express";
import { register,
    login, 
    profile,
    getProfile,
    updateProfile,
    deleteProfile,
    logout
 } from "../controllers/authController";
 import { protect } from "../middleware/authMiddleware";
 import { validateBody } from "../middleware/validate";
import { registerSchema,
    loginSchema,
    updateProfileSchema
 } from "../schemas/authSchemas";
 const router = express.Router();

 router.post("/register", validateBody(registerSchema), register);
 router.post("/login", validateBody(loginSchema), login);
 router.get("/profile", protect, profile);

 export default router;
// This code defines the routes for user authentication and profile management in an Express application. It includes routes for user registration, login, fetching the user profile, updating the profile, and deleting the profile. The routes are protected by middleware to ensure that only authenticated users can access certain endpoints. The request body is validated using Zod schemas to ensure that the data meets the required format before processing it in the controller functions.
 