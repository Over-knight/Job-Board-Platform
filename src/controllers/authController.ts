import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const register = async (req: Request, res: Response): Promise<void> => {
    try{
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
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
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(!user)
            return res.status(400).json({
                status: "fail",
                message: "User not found"
        });
        const isMatch = await bcrypt.compare(password, user.password);
        if( !isMatch) 
            return res.status(400).json({
                status: "fail",
                message: "Invalid credentials"
        });
        const token = jwt.sign({ id: user._id, role: user.role }, 
            process.env.JWT_SECRET || "your_secret_key", 
            {expiresIn: "1d"}
        );
        res.json({ token, user});
    } catch (error) {
        console.error ("LOgin error", error);
        res.status(500).json({ message: "Login error", error});
    }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized"});
            return;
        }
        const user = await User.findById(userId).select("name email role");
        if (!user) {
            res.status(404).json({ message: "User not found"});
            return;
        }
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error("Error fetching profile", error);
        res.status(500).json({
            message: "Error fetching profile",
            error
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized"});
            return;
        }
        const { name, email, password, role } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found"});
            return;
        }
        if (name) user.name = name;
        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email});
            if (emailTaken) {
                res.status(400).json({ message: "Email already in use"});
                return;
            }
            user.email = email;
        }
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        if (role) {
            const validRoles = ["Employer", "Candidate"];
            if (!validRoles.includes(role)) {
                res.status(400).json({ message: "Invalid role"});
                return;
            }
            user.role = role;
        }
        const updatedUser = await user.save();
        const userToReturn = updatedUser.toObject();
        delete (userToReturn as any).password;
        res.json(userToReturn);
    } catch (error) {
        console.error("Error updating profile", error);
        res.status(500).json({ message: "Error updating profile", error});
    }
};

export const deleteProfile = async (req: Request, res: Response): Promise<void> => {
    try{
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: "Not authorized"});
            return;
        }
        const user = await User.findByIdAndDelete(userId);
        res.json({ message: "User deleted successfully"});
    } catch (error) {
        console.error("Error deleting profile:", error);
        res.status(500).json({ message: "Error deleting profile", error});
    }
};
export const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        res.status(200).json({ message: "Logged out successfully"});
    } catch (error) {
        console.error("Error logging out", error);
        res.status(500).json({ message: "Error logging out", error});
    }
};