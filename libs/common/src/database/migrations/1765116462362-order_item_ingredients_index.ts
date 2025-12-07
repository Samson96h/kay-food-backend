import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderItemIngredientsIndex1765116462362 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9eedd51b57926c1df863ebf723" ON "order_item_ingredients" ("order_item_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_19b5828f840851203fcb9c8250" ON "order_item_ingredients" ("ingredient_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_19b5828f840851203fcb9c8250"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9eedd51b57926c1df863ebf723"`);
    }

}
