
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sample } from "./sample.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "mutation_qc" })
export class MutationQC {
    @PrimaryGeneratedColumn({ name: "mutation_id" })
    mutationId: number;

    @ManyToOne(type => Sample, type => type.mutationQC, { primary: true, eager: true })
    @JoinColumn({ name: "sample_id" })
    sample: Sample;

    @Column({ name: "gene_name" })
    geneName: string;

    @Column({ name: "HGVS.c" })
    HGVSc: string;

    @Column({ name: "HGVS.p" })
    HGVSp: string;

    @Column({ name: "cosmic" })
    cosmic: string;

    @Column({ name: "chr" })
    chr: string;

    @Column({ name: "position" })
    position: string;

    @Column({ name: "qc" })
    QC: number;
}
