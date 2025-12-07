import { MigrationInterface, QueryRunner } from "typeorm";

export class IngredientTranslationsAlter1765116547957 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_translations" ADD CONSTRAINT "FK_43193d670934aa25a4d87a036f3" FOREIGN KEY ("ingredientId") REFERENCES "ingredients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ingredient_translations" ADD CONSTRAINT "FK_e95aba88e3b4a5b8bd9c14984cf" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredient_translations" DROP CONSTRAINT "FK_e95aba88e3b4a5b8bd9c14984cf"`);
        await queryRunner.query(`ALTER TABLE "ingredient_translations" DROP CONSTRAINT "FK_43193d670934aa25a4d87a036f3"`);
    }

}
