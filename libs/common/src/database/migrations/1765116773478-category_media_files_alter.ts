import { MigrationInterface, QueryRunner } from "typeorm";

export class CategoryMediaFilesAlter1765116773478 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_media_files" ADD CONSTRAINT "FK_6bd501c260358e2eecc0716a06e" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "category_media_files" ADD CONSTRAINT "FK_d6366cc6d401d1842d6320b8382" FOREIGN KEY ("media_file_id") REFERENCES "media_files"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category_media_files" DROP CONSTRAINT "FK_d6366cc6d401d1842d6320b8382"`);
        await queryRunner.query(`ALTER TABLE "category_media_files" DROP CONSTRAINT "FK_6bd501c260358e2eecc0716a06e"`);
    }

}
