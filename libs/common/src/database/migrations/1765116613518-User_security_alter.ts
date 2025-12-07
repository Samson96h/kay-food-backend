import { MigrationInterface, QueryRunner } from "typeorm";

export class UserSecurityAlter1765116613518 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User_security" ADD CONSTRAINT "FK_fe904b491c0db9f75caa684f7ec" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User_security" DROP CONSTRAINT "FK_fe904b491c0db9f75caa684f7ec"`);
    }

}
