import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryTranslateAlter1765116527563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_translate" ADD CONSTRAINT "FK_760f3d45aabe8733575d74154c2" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "category_translate" ADD CONSTRAINT "FK_6f8470a7f148d243061d879328d" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_translate" DROP CONSTRAINT "FK_6f8470a7f148d243061d879328d"`);
        await queryRunner.query(`ALTER TABLE "category_translate" DROP CONSTRAINT "FK_760f3d45aabe8733575d74154c2"`);
    }

}
