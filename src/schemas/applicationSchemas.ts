import z from "zod"

export const applySchema = z.object({
    resume: z.string().min(1, "Resume (link or text) is required"),
});