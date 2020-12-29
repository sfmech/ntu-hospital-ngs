import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialDatabase1596699016174 implements MigrationInterface {
    name = 'InitialDatabase1596699016174'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "runs" ("run_id" SERIAL NOT NULL, "run_name" character varying NOT NULL, "start_time" timestamp with time zone DEFAULT now(), CONSTRAINT "runs_pkey" PRIMARY KEY ("run_id"))`);
        await queryRunner.query(`CREATE TABLE "samples" ("sample_id" SERIAL NOT NULL, "run_id" SERIAL NOT NULL, "sample_name" character varying, "disease_id" SERIAL NOT NULL, CONSTRAINT "samples_pkey" PRIMARY KEY ("sample_id") , CONSTRAINT "foreign_run" FOREIGN KEY ("run_id") REFERENCES public.runs (run_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE "segments" ("segment_id" SERIAL NOT NULL, "sample_id"  SERIAL NOT NULL, "chr" character varying NOT NULL, "position" character varying NOT NULL, "dbSNP" character varying, "freq" numeric, "depth" integer, "annotation" character varying, "gene_name" character varying, "HGVS.p" character varying NOT NULL, "HGVS.c" character varying NOT NULL, "clinical_significance" character varying, "global_AF" numeric, "AFR_AF" numeric, "AMR_AF" numeric, "EUR_AF" numeric, "ASN_AF" numeric, CONSTRAINT "segments_pkey" PRIMARY KEY ("segment_id"), CONSTRAINT "foreign_sample" FOREIGN KEY ("sample_id") REFERENCES public.samples (sample_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE "filterlist" (gene_name character varying, chr character varying NOT NULL, "position" character varying NOT NULL, "HGVS.c" character varying  NOT NULL, "HGVS.p" character varying  NOT NULL, category character varying NOT NULL, "clinical_significance" character varying, remark character varying NOT NULL, CONSTRAINT pk_filterlist PRIMARY KEY (chr, "position", "HGVS.c", "HGVS.p"))`);
        await queryRunner.query(`CREATE TABLE "setting" (id SERIAL NOT NULL, "name" character varying NOT NULL, "value" character varying  NOT NULL, CONSTRAINT setting_pkey PRIMARY KEY (id))`);
        await queryRunner.query(`CREATE TABLE "diseases" (disease_id SERIAL NOT NULL, zh_name character varying, en_name character varying, abbr character varying, CONSTRAINT diseases_pkey PRIMARY KEY (disease_id))`);
        await queryRunner.query(`CREATE TABLE "mutation_qc" (mutation_id SERIAL NOT NULL, sample_id integer NOT NULL, gene_name character varying, "HGVS.c" character varying, "HGVS.p" character varying, cosmic character varying, chr character varying, position character varying, qc integer, CONSTRAINT mutation_pkey PRIMARY KEY (mutation_id), CONSTRAINT "foreign_mutation" FOREIGN KEY ("sample_id") REFERENCES public.samples (sample_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE "coverage" (coverage_id SERIAL NOT NULL, sample_id integer NOT NULL, chr character varying, amplicon_start character varying, amplicon_end character varying, amplion_name character varying, amplion_mean_coverge numeric, CONSTRAINT coverage_pkey PRIMARY KEY (coverage_id), CONSTRAINT foreign_coverage FOREIGN KEY (sample_id) REFERENCES public.samples (sample_id) MATCH SIMPLE ON UPDATE CASCADE ON DELETE CASCADE)`);
        await queryRunner.query(`CREATE TABLE public.users(user_id serial NOT NULL,user_name character varying NOT NULL,password character varying NOT NULL,user_role character varying NOT NULL, CONSTRAINT users_pkey PRIMARY KEY (user_id))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "segments"`);
        await queryRunner.query(`DROP TABLE "samples"`);
        await queryRunner.query(`DROP TABLE "runs"`);
        await queryRunner.query(`DROP TABLE "filterlist"`);
        await queryRunner.query(`DROP TABLE "setting"`);
        await queryRunner.query(`DROP TABLE "diseases"`);
        await queryRunner.query(`DROP TABLE "mutation_qc"`);
        await queryRunner.query(`DROP TABLE "coverage"`);
        await queryRunner.query(`DROP TABLE "users"`);

    }

}
