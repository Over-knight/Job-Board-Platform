import { title } from "process"
import {z} from "zod"

export const createJobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"), 
    location: z.string().min(1, "Location is required"),
    salary: z.number().positive(),
});