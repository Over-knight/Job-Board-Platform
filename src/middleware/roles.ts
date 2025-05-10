import { Request,
    Response,
    NextFunction
 } from "express";
 export const isCandidate = (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== "candidate") {
        res.status(403).json({ message: "Access denied, Candidates only"});
        return;
    }
    next();
 };

 export const isEmployer = (req: Request, res: Response, next: NextFunction):void => {
    if (req.user?.role !== "employer") {
        res.status(403).json({ message: "Access denied, Employers only"});
        return;
    }
    next();
 ;}