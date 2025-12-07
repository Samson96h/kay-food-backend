import { MigrationInterface, QueryRunner } from "typeorm";

export class IngredientTranslations1765116099375 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ingredient_translations" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "ingredientId" integer, "languageId" integer, CONSTRAINT "PK_0b8e3e0321f43e6f75f5e6ed3d2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ingredient_translations"`);

    }

}
