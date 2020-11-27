import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Coverage } from "./coverage.entity";
import { Disease } from "./disease.entity";
import { MutationQC } from "./mutationQC.entity";
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

    @OneToMany(type => MutationQC, mutationQC => mutationQC.sample)
    mutationQC: MutationQC[];

    @OneToMany(type => Coverage, coverage => coverage.sample)
    coverage: Coverage[];

    @Column({ name: "sample_name" })
    sampleName: string;

    @ManyToOne(type => Disease, type => type.diseaseId, { eager: true })
    @JoinColumn({ name: "disease_id" })
    disease: Disease;

}
