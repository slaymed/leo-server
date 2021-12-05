import { Request, Response } from "express";
import Customer from "../entities/Customer";
import User from "../entities/User";
import client from "./client";

export const listMandates = async (customerId?: string) => {
    try {
        const mandates = await client.mandates.list(
            customerId ? { customer: customerId } : undefined
        );

        return mandates;
    } catch (error) {
        throw error;
    }
};

export const listCustomerMandates = async (_: Request, res: Response) => {
    const customer: Customer = res.locals.customer;

    try {
        const mandates = await listMandates(customer.CustomerID);

        return res.json(mandates);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listAllMandates = async (_: Request, res: Response) => {
    try {
        const mandates = await listMandates();

        return res.json(mandates);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// export const getMandate =async (req: Request, res: Response) => {}

export const createMandate = async (_: Request, res: Response) => {
    const user: User = res.locals.user;
    const customer: Customer = res.locals.customer;

    try {
        const customerBankAccounts = await client.customerBankAccounts.list({
            customer: customer.CustomerID,
        });

        const bankAccount = customerBankAccounts["customer_bank_accounts"][0];

        if (!bankAccount)
            return res
                .status(404)
                .json({ error: "Customer bank account not found" });

        const mandate = await client.mandates.create({
            scheme: "bacs",
            metadata: {
                username: user.username,
            },
            links: {
                customer_bank_account: bankAccount.id,
            },
        });

        return res.json(mandate);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
