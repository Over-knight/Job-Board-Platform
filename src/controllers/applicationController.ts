import { Request, Response } from "express";
import prisma from "../prisma";
import { applySchema } from "../schemas/applicationSchemas";
import z from "zod";


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
        const application = await prisma.application.create({
            data: {
                jobId,
                userId: req.user!.id,
                resume
            },
        });
        res.status(201).json({application});
    } catch (err: any) {
        if (err instanceof z.ZodError){
            res.status(422).json({ errors: err.errors});
            return;
        }
        if (err.code === "P2002") {
            res.status(409).json({ message: "Already applied to the job"});
            return;
        }
        res.status(500).json({ message: err.message});
    }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
    const applications = await prisma.application.findMany({
        where: { userId: req.user!.id },
        include:{ job: true},
        orderBy: { appliedAt: "desc"},
    });
    res.json(applications);
}

export const getJobApplications = async (req:Request, res: Response): Promise<void> => {
    const jobId = Number(req.params.jobId);
        if (Number.isNaN(jobId)) {
            res.status(400).json({ message: "Invalid Job ID"});
            return;
        }
        const job = await prisma.job.findUnique({ where: { id: jobId}});
        if (!job ) {
            res.status(404).json({ message: "Job not found"});
            return;
        }
        if (job.postedById !== req.user!.id) {
            res.status(403).json({ message: "Job not authorized"});
            return;
        }
        const applications = await prisma.application.findMany({
            where: { jobId },
            include:{ candidate: true},
            orderBy: { appliedAt: "desc"},
        });
        res.json(applications);
};