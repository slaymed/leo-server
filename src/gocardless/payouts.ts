import { Request, Response } from "express";
// import User from "../entities/User";
import client from "./client";

export const listPayouts = async (_: Request, res: Response) => {
    // const user: User = res.locals.user;

    // if (!user.getCustomerId())
    //     return res
    //         .status(401)
    //         .json("Your account must be linked with customer");

    try {
        const payouts = await client.payouts.list();

        return res.json(payouts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
