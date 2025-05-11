import { title } from "process"
import {z} from "zod"

export const createJobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"), 
    location: z.string().min(1, "Location is required"),
    company: z.string().min(1, "Company is required"),
    salary: z.number().positive(),
});

export const updateJobShema = createJobSchema
.partial()
.refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update.",
});