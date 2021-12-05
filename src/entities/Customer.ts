import { Length } from "class-validator";
import { Column, Entity, Index, JoinColumn, OneToOne } from "typeorm";
import AppEntity from "./AppEntity";
import User from "./User";

@Entity("customers")
export default class Customer extends AppEntity {
    constructor(customer: Partial<Customer>) {
        super();
        Object.assign(this, customer);
    }
    @Index()
    @Column({ unique: true })
    @Length(14, 14, { message: "Must be 14 Char length" })
    CustomerID: string;

    @Column()
    BelongsTo: string;

    @OneToOne(() => User, (user) => user.customer)
    @JoinColumn({ name: "BelongsTo", referencedColumnName: "username" })
    user: User;
}
