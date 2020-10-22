import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabase1596699016174 implements MigrationInterface {
    name = 'InitialDatabase1596699016174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "runs" ("run_id" SERIAL NOT NULL, "run_name" character varying NOT NULL, "start_time" TIMESTAMP NOT NULL DEFAULT now(), "end_time" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "runs_pkey" PRIMARY KEY ("run_id"))`);
        await queryRunner.query(`CREATE TABLE "samples" ("sample_id" SERIAL NOT NULL, "run_id"  SERIAL NOT NULL, "chr" character varying, "position" character varying, "dbSNP" character varying, "freq" integer, "depth" integer, "annotation" character varying, "gene_name" character varying, "HGVS.p" character varying, "clinical_significance" character varying, "global_AF" integer, "AFR_AF" integer, "AMR_AF" integer, "EUR_AF" integer, "ASN_AF" integer, CONSTRAINT "samples_pkey" PRIMARY KEY ("sample_id"), CONSTRAINT "foreign_run" FOREIGN KEY ("run_id") REFERENCES public.runs (run_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "samples"`);
    }

}
