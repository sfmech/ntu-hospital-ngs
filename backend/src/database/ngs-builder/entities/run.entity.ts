import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany } from "typeorm";
import { Sample } from "./sample.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "runs" })
export class Run {
    @PrimaryGeneratedColumn({ name: "run_id" })
    runId: number;

    @Index({unique: true})
    @Column({ name: "run_name" })
    runName: string;

    @CreateDateColumn({type: 'timestamp with time zone', name: "start_time" })
    startTime: Date;

    @CreateDateColumn({type: 'timestamp with time zone', name: "end_time" })
    endTime: Date;

    @OneToMany(type => Sample, sample => sample.run)
    samples: Sample[];

}
