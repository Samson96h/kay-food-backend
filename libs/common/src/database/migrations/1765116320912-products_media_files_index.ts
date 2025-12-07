import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductsMediaFilesIndex1765116320912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_bb2eec7ac4ac06a1e91ac770f6" ON "products_media_files" ("product_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b5ed1ce724e084d8c5f05948f5" ON "products_media_files" ("media_file_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_b5ed1ce724e084d8c5f05948f5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb2eec7ac4ac06a1e91ac770f6"`);
    }

}
