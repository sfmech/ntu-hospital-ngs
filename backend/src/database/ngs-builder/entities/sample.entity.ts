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

    @CreateDateColumn({name: "patient_birth" })
    patientBirth : Date;

    @Column({ name: "specimen_no"})
    specimenNo: string;

    @Column({ name: "patient_name"})
    patientName: string;

    @Column({ name: "patient_sex"})
    patientSex : string;

    @Column({ name: "specimen_type"})
    specimenType : string;

    @Column({ name: "specimen_status"})
    specimenStatus : string;

    @Column({ name: "note1"})
    note1 : string;
    
    @Column({ name: "note2"})
    note2 : string;

    @Column({ name: "note3"})
    note3 : string;

    @Column({ name: "checker"})
    checker : number;

    @Column({ name: "quality_manager"})
    qualityManager : number;
    
    @Column({ name: "report_doctor"})
    reportDoctor : number;

    @Column({ name: "confirmer"})
    confirmer : number;

    @Column({ name: "total_reads"})
    totalReads: number;

    @Column({ name: "Q20_bases"})
    Q20Bases: number;

    @Column({ name: "Q30_bases"})
    Q30Bases: number;

    @Column({ name: "duplication_rate"})
    duplicationRate: number;

    @Column({ name: "GC_content"})
    GCContent: number;

    @Column({ name: "bed"})
    bed: string;

}
