import { IsEmail, Length } from "class-validator";
import { BeforeInsert, Column, Entity, Index } from "typeorm";
import createId from "../helpers/createId";
import AppEntity from "./AppEntity";

@Entity("admins")
export default class Admin extends AppEntity {
    constructor(admin: Partial<Admin>) {
        super();
        Object.assign(this, admin);
    }

    @Index()
    @Column({ unique: true })
    AdminID: string;

    @Column({ unique: true })
    @IsEmail(undefined, { message: "Must be valid Email Address" })
    @Length(1, 255, { message: "Must not be empty" })
    email: string;

    @Column()
    @Length(6, 255, {
        message: "Password Character length must be at least 6",
    })
    password: string;

    @BeforeInsert()
    setAdminID() {
        this.AdminID = createId(16);
    }
}
