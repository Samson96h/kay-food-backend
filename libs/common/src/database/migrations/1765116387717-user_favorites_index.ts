import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFavoritesIndex1765116387717 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9b10bf53f6d16b355ce259098d" ON "user_favorites" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_152cb1955a8e956ffb7645fdf4" ON "user_favorites" ("productsId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_152cb1955a8e956ffb7645fdf4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b10bf53f6d16b355ce259098d"`);
    }

}
