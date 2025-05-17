import z from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be  at least 6 characters"),
    role: z.enum(["candidate", "employer"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be 'candidate', 'employer'",
    })
    .optional()
    .default("candidate"),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "password required"),
});

export const updateProfileSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().optional(),
    password: z.string().min(6).optional(),
    role: z.enum(["candidate", "employer"], {
        required_error: "Role is required",
        invalid_type_error: "Role must be 'candidate', 'employer'",
    })
    .optional()
    .default("candidate"),
})