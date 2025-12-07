import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductTranslationsAlter1765116595687 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translations" ADD CONSTRAINT "FK_397d78efed9161e89701dbc125d" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_translations" ADD CONSTRAINT "FK_2665ffb0a7886f4521833c7f563" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_translations" DROP CONSTRAINT "FK_2665ffb0a7886f4521833c7f563"`);
        await queryRunner.query(`ALTER TABLE "product_translations" DROP CONSTRAINT "FK_397d78efed9161e89701dbc125d"`);
    }

}
