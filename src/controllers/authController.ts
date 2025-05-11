import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma";
// import User from "../models/userModel";
import { generateToken } from "../utils/generateToken";
import { registerSchema, loginSchema } from "../schemas/authSchemas";


export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, email, password, role } = registerSchema.parse(req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const existingUser = await prisma.user.findUnique({ where: { email}});
        if (existingUser) {
            res.status(400).json({ message: "Email already in use"});
            return;
        }
        const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role } });
    // For now, stub:
        // const user = {
        //     id: 1,
        //     name,
        //     email,
        //     password: hashedPassword,
        //     role
        // };

        const token = generateToken({
            id: user.id,
            role: user.role,
            password: user.password
        })
        res.status(201).json({
            token,
            user: {id: user.id, name, email, role}
        });
    } catch (error) {
        console.error("Error in registering", error);
        res.status(500).json({
            status: "error",
            message: "Error registering user"
        });
    }
};

export const login = async (req: Request, res: Response): Promise<any> => {
    try{
        const {email, password} = loginSchema.parse(req.body);
        const user = await prisma.user.findUnique({ where: { email } });
        if(!user)
            return res.status(401).json({
                status: "fail",
                message: "Invalid credentials"
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch) 
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials"
        });
        const token = generateToken({ id: user.id, role: user.role }, 

        );
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error ("Login error", error);
        res.status(500).json({ message: "Login error", error});
    }
};

export const profile = async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: Number(req.user!.id)}});
    res.json({ user });
  };
// export const getProfile = async (req: Request, res: Response): Promise<void> => {
//     try{
//         const userId = req.user?.id;
//         if (!userId) {
//             res.status(401).json({ message: "Not authorized"});
//             return;
//         }
//         const user = await User.findById(userId).select("name email role");
//         if (!user) {
//             res.status(404).json({ message: "User not found"});
//             return;
//         }
//         res.status(200).json({
//             id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role
//         });
//     } catch (error) {
//         console.error("Error fetching profile", error);
//         res.status(500).json({
//             message: "Error fetching profile",
//             error
//         });
//     }
// };

// export const updateProfile = async (req: Request, res: Response): Promise<void> => {
//     try{
//         const userId = req.user?.id;
//         if (!userId) {
//             res.status(401).json({ message: "Not authorized"});
//             return;
//         }
//         const { name, email, password, role } = req.body;
//         const user = await User.findById(userId);
//         if (!user) {
//             res.status(404).json({ message: "User not found"});
//             return;
//         }
//         if (name) user.name = name;
//         if (email && email !== user.email) {
//             const emailTaken = await User.findOne({ email});
//             if (emailTaken) {
//                 res.status(400).json({ message: "Email already in use"});
//                 return;
//             }
//             user.email = email;
//         }
//         if (password) {
//             user.password = await bcrypt.hash(password, 10);
//         }
//         if (role) {
//             const validRoles = ["Employer", "Candidate"];
//             if (!validRoles.includes(role)) {
//                 res.status(400).json({ message: "Invalid role"});
//                 return;
//             }
//             user.role = role;
//         }
//         const updatedUser = await user.save();
//         const userToReturn = updatedUser.toObject();
//         delete (userToReturn as any).password;
//         res.json(userToReturn);
//     } catch (error) {
//         console.error("Error updating profile", error);
//         res.status(500).json({ message: "Error updating profile", error});
//     }
// };

// export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
//     try{
//         const userId = req.user?.id;
//         if (!userId) {
//             res.status(401).json({ message: "Not authorized"});
//             return;
//         }
//         const user = await User.findByIdAndDelete(userId);
//         res.json({ message: "User deleted successfully"});
//     } catch (error) {
//         console.error("Error deleting profile:", error);
//         res.status(500).json({ message: "Error deleting profile", error});
//     }
// };
// export const logout = async (req: Request, res: Response): Promise<void> => {
//     try{
//         res.status(200).json({ message: "Logged out successfully"});
//     } catch (error) {
//         console.error("Error logging out", error);
//         res.status(500).json({ message: "Error logging out", error});
//     }
// };