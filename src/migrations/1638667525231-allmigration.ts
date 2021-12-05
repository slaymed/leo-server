import {MigrationInterface, QueryRunner} from "typeorm";

export class allmigration1638667525231 implements MigrationInterface {
    name = 'allmigration1638667525231'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "AdminID" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_bc33eb46c975fc7d81c33b8784f" UNIQUE ("AdminID"), CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bc33eb46c975fc7d81c33b8784" ON "admins" ("AdminID") `);
        await queryRunner.query(`CREATE TYPE "public"."orders_propertytype_enum" AS ENUM('I Own the Property', 'I''m renting for a year or less', 'I''m renting for more than a year')`);
        await queryRunner.query(`CREATE TYPE "public"."orders_price_enum" AS ENUM('5700')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "OrderID" character varying NOT NULL, "BelongsTo" character varying NOT NULL, "address" character varying NOT NULL, "needRouter" boolean NOT NULL DEFAULT true, "routerDeliveryAddress" character varying, "city" character varying NOT NULL, "mobile" character varying NOT NULL, "setupDate" character varying, "routerDeliveryDateFrom" character varying, "routerDeliveryDateTo" character varying, "engineerVisiteDate" character varying, "goingLiveDate" character varying, "firstBillDate" character varying, "propertyType" "public"."orders_propertytype_enum" NOT NULL DEFAULT 'I Own the Property', "price" "public"."orders_price_enum" NOT NULL DEFAULT '5700', "routerAddress" character varying, CONSTRAINT "UQ_34282055b8ca50c3ab190e4a4db" UNIQUE ("OrderID"), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_34282055b8ca50c3ab190e4a4d" ON "orders" ("OrderID") `);
        await queryRunner.query(`CREATE TYPE "public"."plans_plantype_enum" AS ENUM('FAST', 'SUPER', 'ULTRA')`);
        await queryRunner.query(`CREATE TYPE "public"."plans_planname_enum" AS ENUM('Fast Fibre', 'Super Fast Fiber', 'Ultra Fast Fibre')`);
        await queryRunner.query(`CREATE TYPE "public"."plans_plantime_enum" AS ENUM('weekly', 'monthly', 'yearly')`);
        await queryRunner.query(`CREATE TYPE "public"."plans_planprice_enum" AS ENUM('2999', '3999', '4999')`);
        await queryRunner.query(`CREATE TABLE "plans" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "PlanID" character varying NOT NULL, "PlanType" "public"."plans_plantype_enum" NOT NULL DEFAULT 'FAST', "PlanName" "public"."plans_planname_enum" NOT NULL DEFAULT 'Fast Fibre', "PlanTime" "public"."plans_plantime_enum" NOT NULL DEFAULT 'monthly', "PlanPrice" "public"."plans_planprice_enum" NOT NULL DEFAULT '2999', CONSTRAINT "UQ_88ffec6996791e96b8205146101" UNIQUE ("PlanID"), CONSTRAINT "PK_3720521a81c7c24fe9b7202ba61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "verificationcodes" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "code" character varying NOT NULL, "BelongsTo" character varying NOT NULL, CONSTRAINT "UQ_3f8ad6ee619a856f29e30c976d0" UNIQUE ("code"), CONSTRAINT "REL_d2b4e67c3474c1ae0e31a05aa6" UNIQUE ("BelongsTo"), CONSTRAINT "PK_eef861d845a886fc3bd0d16874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "postCode" character varying NOT NULL, "address" character varying NOT NULL, "city" character varying NOT NULL, "mobile" character varying NOT NULL, "contryCode" character varying NOT NULL DEFAULT 'GB', "verified" boolean NOT NULL DEFAULT false, "planId" integer, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "customers" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "CustomerID" character varying NOT NULL, "BelongsTo" character varying NOT NULL, CONSTRAINT "UQ_dac83b0348e54909724fc6a3ebd" UNIQUE ("CustomerID"), CONSTRAINT "REL_007924f1dfb66bc4c37b8722d8" UNIQUE ("BelongsTo"), CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dac83b0348e54909724fc6a3eb" ON "customers" ("CustomerID") `);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_40ff99800414022882ef67d6a60" FOREIGN KEY ("BelongsTo") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "verificationcodes" ADD CONSTRAINT "FK_d2b4e67c3474c1ae0e31a05aa63" FOREIGN KEY ("BelongsTo") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_56f2aa669ddbe83eab8a25898b2" FOREIGN KEY ("planId") REFERENCES "plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "customers" ADD CONSTRAINT "FK_007924f1dfb66bc4c37b8722d85" FOREIGN KEY ("BelongsTo") REFERENCES "users"("username") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customers" DROP CONSTRAINT "FK_007924f1dfb66bc4c37b8722d85"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_56f2aa669ddbe83eab8a25898b2"`);
        await queryRunner.query(`ALTER TABLE "verificationcodes" DROP CONSTRAINT "FK_d2b4e67c3474c1ae0e31a05aa63"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_40ff99800414022882ef67d6a60"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dac83b0348e54909724fc6a3eb"`);
        await queryRunner.query(`DROP TABLE "customers"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "verificationcodes"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TYPE "public"."plans_planprice_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plans_plantime_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plans_planname_enum"`);
        await queryRunner.query(`DROP TYPE "public"."plans_plantype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34282055b8ca50c3ab190e4a4d"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_price_enum"`);
        await queryRunner.query(`DROP TYPE "public"."orders_propertytype_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bc33eb46c975fc7d81c33b8784"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
