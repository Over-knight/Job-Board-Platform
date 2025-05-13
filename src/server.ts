import dotenv from "dotenv";
dotenv.config();

import express,
{Request, Response, NextFunction} from "express";

import authRoutes from "./routes/authRoutes";
import jobRoutes from "./routes/jobRoutes";
import applicationRoutes from "./routes/applicationRoutes";
import recommendationRoutes from "./routes/recommendationRoutes";
const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.get("/health", (req: Request, res: Response) =>  {res.send("OK")});

app.use((req, res) => {
    console.warn("No route matched:", req.method, req.url);
    res.status(404).json({ message: "Not Found" });
  });
  app.use((req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.url);
    next();
  });
  

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));