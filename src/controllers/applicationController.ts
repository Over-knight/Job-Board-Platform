import { Request, Response } from "express";
import prisma from "../prisma";
import { applySchema } from "../schemas/applicationSchemas";

export const applyToJob = async (req: Request, res: Response ): Promise<void> => {
    try{
        const { resume} = applySchema.parse(req.body);
        const jobId = Number(req.params.jobId);
        if (Number.isNaN(jobId)) {
            res.status(400).json({ message: "Invalid job ID"});
            return;
        }

        const job = await prisma.job.findUnique({ where: {id: jobId}});
        if (!job) {
            res.status(404).json({ message: "Job not found" });
            return;
        }
    }
}