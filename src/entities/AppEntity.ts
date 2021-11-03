import {
    PrimaryGeneratedColumn,
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { classToPlain, Exclude } from "class-transformer";

export default abstract class AppEntity extends BaseEntity {
    @Exclude()
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    toJSON() {
        return classToPlain(this);
    }
}
