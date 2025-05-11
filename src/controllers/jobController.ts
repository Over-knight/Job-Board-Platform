import { Request, Response } from "express";
import prisma from "../prisma";
import { createJobSchema, updateJobShema } from "../schemas/jobSchema";
import { number } from "zod";
import z from "zod";

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
  // console.log("→ Entered getJobById, params.id =", req.params.id);
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      console.log("Bad Id format")
      res.status(400).json({ message: "Invalid job ID" });   
      return;
    }
    
    // console.log("→ Looking up job", id);
    const job = await prisma.job.findUnique({
      where: { id },
      include: { postedBy: true },
    });
    // console.log("→ DB returned", job);
    
    if (!job) {
      console.log("job not found");
      res.status(404).json({ message: "Job not found" });
      return;
    };
    console.log("sending job");
    res.status(200).json(job);
    return;
};

export const deleteJob = async (req: Request, res: Response): Promise<void> => {
    try{
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
    console.log("deleting jobs")
    res.status(204).send();
    return;
    } catch (error) {
      console.error("Error deleting job", error);
      res.status(500).json({ message: "Error deleting job", error });
  }
  };

  export const updateJob = async (req: Request, res: Response): Promise<void> => {
    const updates = updateJobShema.parse(req.body);

      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json({ message: "Job ID must be a number"})
        return;
      }
      const job = await prisma.job.findUnique({ where: {id} });
      if ( !job ) {
        res.status(404).json({ message: " Job not found"});
        return;
      }
      const userId = req.user!.id;
      if (job.postedById !== req.user!.id) {
        res.status(403).json({ message: "Not authorized to update this job."});
        return;
      }
      const updated = await prisma.job.update({
        where: {id},
        data: updates,
      });
      res.json(updated); 
  }