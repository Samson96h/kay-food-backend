import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSecurity1765116155355 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "User_security" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "attempts_count" integer NOT NULL DEFAULT '0', "block_count" integer NOT NULL DEFAULT '0', "blocked_until" TIMESTAMP WITH TIME ZONE, "userId" integer, CONSTRAINT "REL_fe904b491c0db9f75caa684f7e" UNIQUE ("userId"), CONSTRAINT "PK_aab6510bbcea81480ffada2fa24" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "User_security"`);
    }

}
