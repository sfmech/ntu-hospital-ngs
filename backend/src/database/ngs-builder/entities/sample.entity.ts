import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Run } from "./run.entity";
import { Segment } from "./segment.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "samples" })
export class Sample {
    @PrimaryGeneratedColumn({ name: "sample_id" })
    sampleId: number;

    @ManyToOne(type => Run, type => type.samples, { primary: true, eager: true })
    @JoinColumn({ name: "run_id" })
    run: Run;

    @OneToMany(type => Segment, segment => segment.sample)
    segments: Segment[];

    @Column({ name: "sample_name" })
    sampleName: string;

    @Column({ name: "disease" })
    disease: string;

}
