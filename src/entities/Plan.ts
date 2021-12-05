import { BeforeInsert, Column, Entity, OneToMany } from "typeorm";
import createId from "../helpers/createId";
import AppEntity from "./AppEntity";
import User from "./User";

export const FAST = "FAST";
export const SUPER = "SUPER";
export const ULTRA = "ULTRA";

export type PlanTypeEnum = typeof FAST | typeof SUPER | typeof ULTRA;

export const FAST_PLAN_PRICE = 2999;
export const SUPER_FAST_PLAN_PRICE = 3999;
export const ULTRA_FAST_PLAN_PRICE = 4999;

export type PlanPriceEnum =
    | typeof FAST_PLAN_PRICE
    | typeof SUPER_FAST_PLAN_PRICE
    | typeof ULTRA_FAST_PLAN_PRICE;

export const FAST_FIBRE = "Fast Fibre";
export const SUPER_FAST_FIBRE = "Super Fast Fiber";
export const ULTRA_FAST_FIBRE = "Ultra Fast Fibre";

export type OrderType =
    | typeof FAST_FIBRE
    | typeof SUPER_FAST_FIBRE
    | typeof ULTRA_FAST_FIBRE;

export const WEEKLY = "weekly";
export const MONTHLY = "monthly";
export const YEARLY = "yearly";

export type PlanTime = typeof WEEKLY | typeof MONTHLY | typeof YEARLY;

@Entity("plans")
export default class Plan extends AppEntity {
    constructor(plan: Partial<Plan>) {
        super();
        Object.assign(this, plan);
    }

    @Column({ unique: true })
    PlanID: string;

    @Column({ type: "enum", enum: [FAST, SUPER, ULTRA], default: FAST })
    PlanType: PlanTypeEnum;

    @Column({
        type: "enum",
        enum: [FAST_FIBRE, SUPER_FAST_FIBRE, ULTRA_FAST_FIBRE],
        default: FAST_FIBRE,
    })
    PlanName: OrderType;

    @Column({ type: "enum", enum: [WEEKLY, MONTHLY, YEARLY], default: MONTHLY })
    PlanTime: PlanTime;

    @Column({
        type: "enum",
        enum: [FAST_PLAN_PRICE, SUPER_FAST_PLAN_PRICE, ULTRA_FAST_PLAN_PRICE],
        default: FAST_PLAN_PRICE,
    })
    protected PlanPrice: PlanPriceEnum;
    getPlanPrice() {
        return this.PlanPrice;
    }

    @BeforeInsert()
    handleRequirement() {
        this.PlanID = createId(16);

        if (this.PlanType === FAST) {
            this.PlanPrice = FAST_PLAN_PRICE;
            this.PlanName = FAST_FIBRE;
            this.PlanTime = MONTHLY;
        }

        if (this.PlanType === SUPER) {
            this.PlanPrice = SUPER_FAST_PLAN_PRICE;
            this.PlanName = SUPER_FAST_FIBRE;
            this.PlanTime = MONTHLY;
        }

        if (this.PlanType === ULTRA) {
            this.PlanPrice = ULTRA_FAST_PLAN_PRICE;
            this.PlanName = ULTRA_FAST_FIBRE;
            this.PlanTime = MONTHLY;
        }
    }

    @OneToMany(() => User, (user) => user.plan)
    users: User[];
}
