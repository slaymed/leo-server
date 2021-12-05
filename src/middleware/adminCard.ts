import { Request, Response, NextFunction } from "express";

import Admin from "../entities/Admin";

export default async (_: Request, res: Response, next: NextFunction) => {
    try {
        const admin: Admin | undefined = res.locals.admin;

        if (!admin) throw new Error("Need Admin Permission");

        return next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ error: err.message || err });
    }
};
