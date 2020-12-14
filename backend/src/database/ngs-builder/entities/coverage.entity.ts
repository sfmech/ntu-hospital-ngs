
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sample } from "./sample.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "coverage" })
export class Coverage {
    @PrimaryGeneratedColumn({ name: "coverage_id" })
    coverageId: number;

    @ManyToOne(type => Sample, type => type.mutationQC, { primary: true, eager: true })
    @JoinColumn({ name: "sample_id" })
    sample: Sample;

    @Column({ name: "chr" })
    chr: string;

    @Column({ name: "amplicon_start" })
    ampliconStart: string;

    @Column({ name: "amplicon_end" })
    ampliconEnd: string;

    @Column({ name: "amplion_name" })
    amplionName: string;

    @Column({ name: "amplion_mean_coverge" })
    amplion_mean_coverge: number;
}
