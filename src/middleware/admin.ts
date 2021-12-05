import { Request, Response, NextFunction } from "express";
import Admin from "../entities/Admin";
import verifyToken from "../helpers/verifyToken";

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const adminToken: string = req.cookies.adminToken;

        if (!adminToken) return next();

        // verify token
        const { email }: any = verifyToken(adminToken, process.env.JWT_SECRET!);

        // find the user
        const admin: Admin | undefined = await Admin.findOne({ email });

        if (!admin) throw new Error("Unauthorized, Need Admin Role");

        res.locals.admin = admin;

        return next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};
