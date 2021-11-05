import { IsEmail, Length } from "class-validator";
import { Column, Entity, Index } from "typeorm";
import AppEntity from "./AppEntity";

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
    postCode: string;
}
