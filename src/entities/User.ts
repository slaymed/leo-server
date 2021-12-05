import { Exclude } from "class-transformer";
import { IsEmail, Length } from "class-validator";
import { Column, Entity, Index, ManyToOne, OneToMany, OneToOne } from "typeorm";
import AppEntity from "./AppEntity";
import Customer from "./Customer";
import Order from "./Order";
import Plan from "./Plan";
import VerificationCode from "./VerificationCode";

export const ADMIN = "ADMIN";
export const CUSTOMER = "CUSTOMER";

export type UserType = typeof ADMIN | typeof CUSTOMER;

@Entity("users")
export default class User extends AppEntity {
    constructor(user: Partial<User>) {
        super();
        Object.assign(this, user);
    }

    @Index()
    @Length(3, 255, { message: "Must be at least 3 Char long" })
    @Column({ unique: true })
    username: string;

    @Index()
    @IsEmail(undefined, { message: "Must be a valid email address" })
    @Length(1, 255, { message: "Must not be empty" })
    @Column({ unique: true })
    email: string;

    @Column()
    @Length(3, 255, { message: "Must be at least 3 Char long" })
    firstName: string;

    @Column()
    @Length(3, 255, { message: "Must be at least 3 Char long" })
    lastName: string;

    @Column()
    @Length(3, 255, { message: "Must be at least 3 Char long" })
    postCode: string;

    @Column()
    @Length(1, 255, { message: "Must not be empty" })
    address: string;

    @Column()
    @Length(1, 255, { message: "Must not be empty" })
    city: string;

    @Column()
    @Length(1, 255, { message: "Must not be empty" })
    mobile: string;

    @Exclude()
    @Column({ default: "GB" })
    protected contryCode: string;
    getContryCode() {
        return this.contryCode;
    }
    updateContryCode(contryCode: string) {
        if (!contryCode) return;
        if (this.contryCode === contryCode) return;
        this.contryCode = contryCode;
    }

    @Column({ default: false })
    protected verified: boolean;
    checkVerification() {
        return this.verified;
    }
    verifyAccount() {
        this.verified = true;
    }

    @OneToOne(() => Customer, (customer) => customer.user)
    customer: Customer;

    @OneToOne(
        () => VerificationCode,
        (verificationCode) => verificationCode.user
    )
    verificationCode: VerificationCode;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @ManyToOne(() => Plan, (plan) => plan.users)
    plan: Plan;
}
