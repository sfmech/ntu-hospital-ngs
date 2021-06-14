import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Aligned } from "./aligned.entity";
import { Coverage } from "./coverage.entity";
import { Disease } from "./disease.entity";
import { MutationQC } from "./mutationQC.entity";
import { Run } from "./run.entity";
import { Segment } from "./segment.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "samples" })
export class Sample {
    @PrimaryGeneratedColumn({ name: "sample_id" })
    sampleId: number;

    @ManyToOne(type => Run, type => type.samples, { eager: true })
    @JoinColumn({ name: "run_id" })
    run: Run;

    @OneToMany(type => Segment, segment => segment.sample)
    segments: Segment[];

    @OneToMany(type => MutationQC, mutationQC => mutationQC.sample)
    mutationQC: MutationQC[];

    @OneToMany(type => Coverage, coverage => coverage.sample)
    coverage: Coverage[];

    @OneToMany(type => Aligned, aligned => aligned.sample)
    aligned: Aligned[];

    @Column({ name: "sample_name" })
    sampleName: string;

    @ManyToOne(type => Disease, type => type.diseaseId, { eager: true })
    @JoinColumn({ name: "disease_id" })
    disease: Disease;

    @Column({ name: "medical_record_no"})
    medicalRecordNo: string;
    
    @Column({ name: "sid"})
    SID: string;

    @Column({ name: "department_no"})
    departmentNo: string;

    @CreateDateColumn({type: 'timestamp with time zone', name: "check_date" })
    checkDate: Date;

}
