import { Length } from "class-validator";
import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
} from "typeorm";
import createId from "../helpers/createId";
import AppEntity from "./AppEntity";
import User from "./User";

export const OWN_PROPERTY = "I Own the Property";
export const YEAR_PROPERTY = "I'm renting for a year or less";
export const MORE_THAN_YEAR_PROPERTY = "I'm renting for more than a year";

export type PropertyTypeEnum =
    | typeof OWN_PROPERTY
    | typeof YEAR_PROPERTY
    | typeof MORE_THAN_YEAR_PROPERTY;

export type OrderSteps = {
    setupDate: string;
    routerDeliveryDate: string;
    engineerVisiteDate: string;
    goingLiveDate: string;
    firstBillDate: string;
};

export const DEFAULT_ORDER_PRICE = 5700;

export type PriceEnum = typeof DEFAULT_ORDER_PRICE;

@Entity("orders")
export default class Order extends AppEntity {
    constructor(order: Partial<Order>) {
        super();
        Object.assign(this, order);
    }

    @Index()
    @Column({ unique: true })
    OrderID: string;

    @Column()
    BelongsTo: string;

    @Column()
    @Length(1, 255, { message: "Must not be Empty" })
    address: string;

    @Column({ default: true })
    needRouter: boolean;

    @Column({ nullable: true })
    routerDeliveryAddress: string;

    @Column()
    @Length(1, 255, { message: "Must not be Empty" })
    city: string;

    @Column()
    @Length(1, 255, { message: "Must not be empty" })
    mobile: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    setupDate: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    routerDeliveryDateFrom: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    routerDeliveryDateTo: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    engineerVisiteDate: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    goingLiveDate: string;

    @Column({ nullable: true })
    @Length(1, 255, { message: "Must not be empty" })
    firstBillDate: string;

    @Column({
        type: "enum",
        enum: [OWN_PROPERTY, YEAR_PROPERTY, MORE_THAN_YEAR_PROPERTY],
        default: OWN_PROPERTY,
    })
    propertyType: PropertyTypeEnum;

    @Column({
        type: "enum",
        enum: [DEFAULT_ORDER_PRICE],
        default: DEFAULT_ORDER_PRICE,
    })
    price: PriceEnum;

    @Column({ nullable: true })
    protected routerAddress: string;
    getRouterAddress() {
        if (!this.needRouter) return;
        return this.routerAddress;
    }
    updateRouterAddress(routerAddress: string) {
        this.routerAddress = routerAddress;
    }

    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: "BelongsTo", referencedColumnName: "username" })
    user: User;

    @BeforeInsert()
    createOrderID() {
        this.OrderID = createId(16);
    }
}
