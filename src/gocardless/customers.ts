import { Request, Response } from "express";
import Customer from "../entities/Customer";
import User from "../entities/User";
import validateKeysValues from "../helpers/validateKeysValues";
import client from "./client";
import { CreateCustomerInput } from "./types";

export const listCustomers = async (_: Request, res: Response) => {
    try {
        const customers = await client.customers.list();

        return res.json(customers);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createCustomerHelper = async (
    customerInput: Partial<CreateCustomerInput>
) => {
    const errors = validateKeysValues(customerInput);

    try {
        if (Object.keys(errors).length > 0) throw new Error(errors);

        const customer = await client.customers.create(customerInput);

        return customer;
    } catch (error) {
        throw new Error(error);
    }
};

export const createCustomer = async (_: Request, res: Response) => {
    const user: User = res.locals.user;

    try {
        const customerFound = await Customer.findOne({
            user: { username: user.username },
        });

        if (customerFound)
            return res.status(500).json({ general: "Already Have A Customer" });

        const syncedCustomer = await createCustomerHelper({
            address_line1: user.address,
            given_name: user.firstName,
            family_name: user.lastName,
            email: user.email,
            postal_code: user.postCode,
            country_code: user.getContryCode(),
            city: user.city,
            metadata: {
                username: user.username,
            },
        });

        const customer = new Customer({
            CustomerID: syncedCustomer.id,
            user,
        });

        await customer.save();

        return res.json(syncedCustomer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getCustomer = async (customerId: string) => {
    try {
        return await client.customers.find(customerId);
    } catch (error) {
        throw error;
    }
};

export const getUserCustomer = async (_: Request, res: Response) => {
    const customer: Customer = res.locals.customer;

    try {
        const syncedCustomer = await getCustomer(customer.CustomerID);
        return res.json(syncedCustomer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const removeUserCustomer = async (_: Request, res: Response) => {
    const customer: Customer = res.locals.customer;

    try {
        await client.customers.remove(customer.CustomerID);

        return res.json({
            success: true,
            message: "Customer Removed By Success",
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
