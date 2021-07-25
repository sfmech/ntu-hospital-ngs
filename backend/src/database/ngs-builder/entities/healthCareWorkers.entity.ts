
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ database: "NTU_Hospital_NGS", name: "health_care_workers" })
export class HealthCareWorkers {
    @PrimaryGeneratedColumn({ name: "worker_id" })
    workerId: number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "number" })
    number: string;

    @Column({ name: "role" })
    role: string;

}
