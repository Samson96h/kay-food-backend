import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaFiles1765116240878 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "media_files" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "path" character varying NOT NULL, "size" integer NOT NULL, "meta" jsonb, CONSTRAINT "PK_93b4da6741cd150e76f9ac035d8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "media_files"`);
    }

}
