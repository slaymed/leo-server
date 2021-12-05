import { dayjs, generateStepsDate } from "./date";
import { Request, Response, Router } from "express";
import Customer from "../entities/Customer";
import Order from "../entities/Order";
import Plan, { FAST, SUPER, ULTRA } from "../entities/Plan";
import User from "../entities/User";
import client from "../gocardless/client";

import {
    createCustomerBankAccount,
    getCustomerbankAccounts,
    getOwnCustomerBankAccounts,
    listCustomersBankAccounts,
} from "../gocardless/customerBankAccounts";
import {
    createCustomer,
    getUserCustomer,
    listCustomers,
    removeUserCustomer,
} from "../gocardless/customers";
import {
    createMandate,
    listAllMandates,
    listCustomerMandates,
} from "../gocardless/mandate";
import {
    createPayment,
    getUserPayments,
    listPayments,
} from "../gocardless/payments";
import { listPayouts } from "../gocardless/payouts";
import admin from "../middleware/admin";
import adminCard from "../middleware/adminCard";
import auth from "../middleware/auth";
import customer from "../middleware/customer";
import user from "../middleware/user";
import { validate } from "class-validator";

const joinLeo = async (req: Request, res: Response) => {
    const customer: Customer = res.locals.customer;
    const user: User = res.locals.user;

    const {
        engineerDate,
        needRouter,
        propertyType,
        planType: PlanType,
        routerDeliveryAddress,
    } = req.body;

    const suppertedPlans = [FAST, SUPER, ULTRA];

    if (!suppertedPlans.includes(PlanType))
        return res.status(500).json({ error: "Unsupported Plan" });

    const stepsDate = generateStepsDate(engineerDate);

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

        if (!customerBankAccount)
            return res.status(500).json({ error: "Somthing went wrong" });

        const orderCreatedBefore = await Order.findOne({
            where: {
                user,
            },
        });

        if (orderCreatedBefore)
            return res.status(500).json({ error: "You already joind us" });

        const order = new Order({
            user,
            address: user.address,
            city: user.city,
            ...stepsDate,
            needRouter,
            routerDeliveryAddress,
            mobile: user.mobile,
            propertyType,
        });

        const customerBankAccounts = await getCustomerbankAccounts(
            customer.CustomerID
        );

        const bankAccount = customerBankAccounts[0];

        if (!bankAccount)
            return res
                .status(404)
                .json({ error: "Customer bank account not found" });

        const orderErrors = validate(order);

        if (Object.keys(orderErrors).length > 0) return res.status;

        await order.save();

        const mandate = await client.mandates.create({
            scheme: "bacs",
            metadata: {
                username: user.username,
            },
            links: {
                customer_bank_account: bankAccount.id,
            },
        });

        const payment = await client.payments.create({
            amount: order.price,
            currency: "GBP",
            description: "Joining leo Boardband",
            metadata: {
                username: user.username,
            },
            links: {
                mandate: mandate.id,
            },
        });

        if (!payment)
            return res.status(500).json({ error: "Somthing went wrong" });

        let plan = await Plan.findOne({ PlanType });

        if (!plan) {
            const newPlan = new Plan({
                PlanType,
            });

            await newPlan.save();

            plan = newPlan;
        }

        const syncedUser = await User.findOne(
            { username: user.username },
            { relations: ["plan"] }
        );

        if (syncedUser?.plan)
            return res
                .status(404)
                .json({ error: "You're already subscribed to us!" });

        user.plan = plan;

        await user.save();

        await client.subscriptions.create({
            amount: plan.getPlanPrice(),
            currency: "GBP",
            name: plan.PlanName,
            interval_unit: plan.PlanTime,
            day_of_month: dayjs(order.firstBillDate).format("D"),
            metadata: {
                username: user.username,
            },
            links: {
                mandate: mandate.id,
            },
        });

        return res.json({ success: true, plan, order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const globalData = async (_: Request, res: Response) => {
    const user: User = res.locals.user;

    let errors: any = {};

    try {
        const syncedUser = await User.findOne(
            { username: user.username },
            { relations: ["plan"] }
        );

        if (!syncedUser?.plan) errors.plan = "You Must be Subscribed";

        const order = await Order.findOne({ user });

        if (!order) errors.order = "You Must be Joined";

        if (Object.keys(errors).length > 0) return res.status(500).json(errors);

        return res.json({ success: true, plan: syncedUser?.plan, order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const router = Router();

router.get("/customers", admin, adminCard, listCustomers);
router.get("/ownCustomer", user, auth, customer, getUserCustomer);

router.post("/customers", user, auth, createCustomer);
router.delete("/ownCustomer", user, auth, customer, removeUserCustomer);

router.get(
    "/ownBankAccounts",
    user,
    auth,
    customer,
    getOwnCustomerBankAccounts
);
router.get("/bankAccounts", admin, adminCard, listCustomersBankAccounts);
router.post("/bankAccounts", user, auth, customer, createCustomerBankAccount);

router.get("/mandates", admin, adminCard, listAllMandates);
router.get("/ownMandates", user, auth, customer, listCustomerMandates);
router.post("/mandates", user, auth, customer, createMandate);

router.get("/payments", admin, adminCard, listPayments);
router.get("/ownPayments", user, auth, getUserPayments);
router.post("/payments/:mandateId", user, auth, customer, createPayment);

router.get("/payouts", user, auth, customer, listPayouts);

router.post("/join", user, auth, customer, joinLeo);
router.get("/globalData", user, auth, customer, globalData);

export default router;
