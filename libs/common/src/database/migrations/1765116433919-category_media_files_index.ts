import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryMediaFilesIndex1765116433919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_6bd501c260358e2eecc0716a06" ON "category_media_files" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d6366cc6d401d1842d6320b838" ON "category_media_files" ("media_file_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_d6366cc6d401d1842d6320b838"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bd501c260358e2eecc0716a06"`);
    }

}
