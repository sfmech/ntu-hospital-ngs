import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabase1596699016174 implements MigrationInterface {
    name = 'InitialDatabase1596699016174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "runs" ("run_id" SERIAL NOT NULL, "run_name" character varying NOT NULL, "start_time" timestamp with time zone DEFAULT now(), CONSTRAINT "runs_pkey" PRIMARY KEY ("run_id"))`);
        await queryRunner.query(`CREATE TABLE "samples" ("sample_id" SERIAL NOT NULL, "run_id" SERIAL NOT NULL, "sample_name" character varying, "disease" character varying, CONSTRAINT "samples_pkey" PRIMARY KEY ("sample_id") , CONSTRAINT "foreign_run" FOREIGN KEY ("run_id") REFERENCES public.runs (run_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE "segments" ("segment_id" SERIAL NOT NULL, "sample_id"  SERIAL NOT NULL, "chr" character varying NOT NULL, "position" character varying NOT NULL, "dbSNP" character varying, "freq" numeric, "depth" integer, "annotation" character varying, "gene_name" character varying, "HGVS.p" character varying NOT NULL, "HGVS.c" character varying NOT NULL, "clinical_significance" character varying, "global_AF" numeric, "AFR_AF" numeric, "AMR_AF" numeric, "EUR_AF" numeric, "ASN_AF" numeric, CONSTRAINT "segments_pkey" PRIMARY KEY ("segment_id"), CONSTRAINT "foreign_sample" FOREIGN KEY ("sample_id") REFERENCES public.samples (sample_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE "filterlist" (chr character varying NOT NULL, "position" character varying NOT NULL, "HGVS.c" character varying  NOT NULL, "HGVS.p" character varying  NOT NULL, category character varying NOT NULL, CONSTRAINT pk_filterlist PRIMARY KEY (chr, "position", "HGVS.c", "HGVS.p"))`);
        await queryRunner.query(`CREATE TABLE "setting" (id SERIAL NOT NULL, "name" character varying NOT NULL, "value" character varying  NOT NULL, CONSTRAINT setting_pkey PRIMARY KEY (id))`);
        await queryRunner.query(`CREATE TABLE "diseases" (disease_id SERIAL NOT NULL, zh_name character varying, en_name character varying, abbr character varying, CONSTRAINT diseases_pkey PRIMARY KEY (disease_id))`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "segments"`);
        await queryRunner.query(`DROP TABLE "samples"`);
        await queryRunner.query(`DROP TABLE "runs"`);
        await queryRunner.query(`DROP TABLE "filterlist"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "diseases"`);
    }

}
