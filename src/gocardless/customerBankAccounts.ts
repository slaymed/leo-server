import { Request, Response } from "express";
import Customer from "../entities/Customer";
import User from "../entities/User";
import client from "./client";

export const getCustomerbankAccounts = async (customerId?: string) => {
    try {
        const customerBankAccounts = await client.customerBankAccounts.list({
            customer: customerId,
        });

        return customerBankAccounts["customer_bank_accounts"];
    } catch (error) {
        throw error;
    }
};

export const getOwnCustomerBankAccounts = async (_: Request, res: Response) => {
    const customer: Customer = res.locals.customer;

    try {
        const customerBankAccounts = await getCustomerbankAccounts(
            customer.CustomerID
        );

        return res.json(customerBankAccounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const listCustomersBankAccounts = async (_: Request, res: Response) => {
    try {
        const customerBankAccounts = await getCustomerbankAccounts();

        return res.json(customerBankAccounts);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createCustomerBankAccount = async (
    req: Request,
    res: Response
) => {
    const user: User = res.locals.user;
    const customer: Customer = res.locals.customer;
    const { branch_code, account_number, account_holder_name } = req.body;

    const errors: any = {};

    if (!branch_code?.trim()) errors.branch_code = "Must not be empty";
    if (!account_number?.trim()) errors.account_number = "Must not be empty";
    if (!account_holder_name?.trim())
        errors.account_holder_name = "Must not be empty";

    if (Object.keys(errors).length > 0) return res.status(500).json(errors);

    try {
        const customerBankAccount = await client.customerBankAccounts.create({
            account_number,
            branch_code,
            account_holder_name,
            country_code: user.getContryCode(),
            links: {
                customer: customer.CustomerID,
            },
        });

        return res.json(customerBankAccount);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
