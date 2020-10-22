import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Run } from "./run.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "samples" })
export class Sample {
    @PrimaryGeneratedColumn({ name: "sample_id" })
    sampleId: number;

    @ManyToOne(type => Run, type => type.samples, { primary: true, eager: true })
    @JoinColumn({ name: "run_id" })
    run: Run;

    @Column({ name: "chr" })
    chr: string;

    @Column({ name: "position" })
    position: string;

    @Column({ name: "dbSNP" })
    dbSNP: string;

    @Column({ name: "freq" })
    freq: number;

    @Column({ name: "depth" })
    depth: number;

    /* change type to enum */
    @Column({ name: "annotation" })
    annotation: string;

    @Column({ name: "gene_name" })
    geneName: string;

    @Column({ name: "HGVS.p" })
    HGVSp: string;

    /* change type to enum */
    @Column({ name: "clinical_significance" })
    clinicalSignificance: string;

    @Column({ name: "global_AF" })
    globalAF: number;

    @Column({ name: "AFR_AF" })
    AFRAF: number;

    @Column({ name: "AMR_AF" })
    AMRAF: number;

    @Column({ name: "EUR_AF" })
    EURAF: number;

    @Column({ name: "ASN_AF" })
    ASNAF: number;



}
