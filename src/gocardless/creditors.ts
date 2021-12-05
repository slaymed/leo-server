import { Request, Response } from "express";
import client from "./client";

export const createCreditor = async (req: Request, res: Response) => {
    const { name, address_line1, city, postal_code, country_code } = req.body;

    try {
        const creditor = await client.creditors.create({
            name,
            address_line1,
            city,
            postal_code,
            country_code,
        });

        return res.json(creditor);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json("Somthing went wrong");
    }
};
