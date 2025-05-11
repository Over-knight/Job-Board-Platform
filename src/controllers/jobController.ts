import { Request, Response } from "express";
import prisma from "../prisma";
import { createJobSchema } from "../schemas/jobSchema";
import { number } from "zod";

export const createJob = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, location, company, salary } = createJobSchema.parse(req.body);
        const userId = req.user?.id;

        if (!userId) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }

        const job = await prisma.job.create({
            data: {
                title,
                description,
                location,
                company,
                salary: Number(salary),
                postedById: Number(userId),
            },
        });

        res.status(201).json({ job });
    } catch (error) {
        console.error("Error creating job", error);
        res.status(500).json({ message: "Error creating job", error });
    }
};

export const getJobs = async (req: Request, res: Response): Promise<void> => {
    const jobs = await prisma.job.findMany({ include: {postedBy: true}});
    res.json({ jobs });
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid job ID" });   
      return;
    }
    
    const job = await prisma.job.findUnique({
      where: { id },
      include: { postedBy: true },
    });
    
  if (!job) 
    res.status(404).json({ message: "Job not found" });
  return;
  res.json(job);
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ message: "Invalid job ID" });   
      return;
    }
    const job = await prisma.job.findUnique({ where: { id: Number(req.params.id) } });
  
    if (!job || number !== number) {
      res.status(403).json({ message: "Not authorized to delete this job" });
      return;
    }
  
    await prisma.job.delete({ where: { id } });
    res.status(204).send();
  };