import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sample } from "./sample.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "segments" })
export class Segment {
    @PrimaryGeneratedColumn({ name: "segment_id" })
    segmentId: number;

    @ManyToOne(type => Sample, type => type.segments, { primary: true, eager: true })
    @JoinColumn({ name: "sample_id" })
    sample: Sample;

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

    @Column({ name: "HGVS.c" })
    HGVSc: string;

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

    @Column({ name: "category"})
    category: string;

    @Column({ name: "note"})
    note: string;


}
