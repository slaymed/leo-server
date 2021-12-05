import { Request, Response, NextFunction } from "express";
import Customer from "../entities/Customer";

import User from "../entities/User";

export default async (_: Request, res: Response, next: NextFunction) => {
    try {
        const user: User = res.locals.user;

        const customer = await Customer.findOne({ user });

        if (!customer)
            throw new Error("Your Account need to be linked with Customer!");

        res.locals.customer = customer;

        return next();
    } catch (err) {
        return res.status(401).json({ error: err.message || err });
    }
};
