import { MigrationInterface, QueryRunner } from "typeorm";

export class UserFavoritesAlter1765116754474 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_9b10bf53f6d16b355ce259098d0" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorites" ADD CONSTRAINT "FK_152cb1955a8e956ffb7645fdf40" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_152cb1955a8e956ffb7645fdf40"`);
        await queryRunner.query(`ALTER TABLE "user_favorites" DROP CONSTRAINT "FK_9b10bf53f6d16b355ce259098d0"`);
    }

}
