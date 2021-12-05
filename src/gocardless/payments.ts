import { Request, Response } from "express";
import User from "../entities/User";
import client from "./client";

export const createPayment = async (req: Request, res: Response) => {
    const user: User = res.locals.user;
    const { mandateId } = req.params;
    const amount: number = req.body.amount;

    try {
        if (amount === undefined || amount === null)
            return res.status(500).json({ amount: "Must not be Empty" });

        if (typeof amount !== "number")
            return res.status(500).json({ amount: "Must be a Number" });

        if (amount < 50 || amount > 1000000)
            return res.status(500).json({ amount: "Must be valid Amount" });

        const payment = await client.payments.create({
            amount,
            currency: "GBP",
            metadata: {
                username: user.username,
            },
            links: {
                mandate: mandateId,
            },
        });

        return res.json(payment);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export type PaymentsFilter = {};

const getPayments = async () => {
    try {
        return await client.payments.list();
    } catch (error) {
        throw error;
    }
};

export const getUserPayments = async (_: Request, res: Response) => {
    const user: User = res.locals.user;

    try {
        let syncedPayments = await getPayments();

        console.log(syncedPayments["payments"]["metadata"]);

        const payments: any[] = syncedPayments["payments"];

        if (payments.length > 0) {
            syncedPayments["payments"] = payments.filter(
                (payment) => payment.metadata.username === user.username
            );
        }

        return res.json(syncedPayments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listPayments = async (_: Request, res: Response) => {
    try {
        const payments = await getPayments();

        return res.json(payments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
