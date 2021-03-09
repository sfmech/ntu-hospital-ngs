
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { Sample } from "./sample.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "aligned" })
export class Aligned {
    @PrimaryGeneratedColumn({ name: "aligned_id" })
    alignedId: number;

    @ManyToOne(type => Sample, type => type.aligned, { primary: true, eager: true })
    @JoinColumn({ name: "sample_id" })
    sample: Sample;

    @Column({ name: "alignment_rate" })
    alignmentRate: number;

    @Column({ name: "mean_coverage" })
    meanCoverage: number;

    @Column({ name: "cover_region_percentage" })
    coverRegionPercentage: number;

    @Column({ name: "control_1" })
    control1: number;

    @Column({ name: "control_2" })
    control2: number;

    @Column({ name: "control_3" })
    control3: number;
}
