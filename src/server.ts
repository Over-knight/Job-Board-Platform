import dotenv from "dotenv";
dotenv.config();

import express,
{Request, Response, NextFunction} from "express";

import authRoutes from "./routes/authRoutes";

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/health", (req: Request, res: Response) =>  {res.send("OK")});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));