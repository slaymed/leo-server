import { Request, Response, NextFunction } from "express";

import User from "../entities/User";

export default async (_: Request, res: Response, next: NextFunction) => {
    try {
        const user: User | undefined = res.locals.user;

        if (!user) throw new Error("Unathenticated");

        return next();
    } catch (err) {
        console.log(err.message);
        return res.status(401).json({ error: "Unathenticated" });
    }
};
