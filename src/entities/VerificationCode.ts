import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from "typeorm";
import createVerificationCode from "../helpers/createVerificationCode";
import AppEntity from "./AppEntity";
import User from "./User";

@Entity("verificationcodes")
export default class VerificationCode extends AppEntity {
    constructor(verificationCode: Partial<VerificationCode>) {
        super();
        Object.assign(this, verificationCode);
    }

    @Column({ unique: true })
    protected code: string;
    getCode() {
        return this.code;
    }

    @Column()
    BelongsTo: string;

    @OneToOne(() => User, (user) => user.verificationCode)
    @JoinColumn({ name: "BelongsTo", referencedColumnName: "username" })
    user: User;

    @BeforeInsert()
    setCode() {
        this.code = createVerificationCode();
    }
}
