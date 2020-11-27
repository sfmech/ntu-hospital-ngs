import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany } from "typeorm";

@Entity({ database: "NTU_Hospital_NGS", name: "diseases" })
export class Disease {
    @PrimaryGeneratedColumn({ name: "disease_id" })
    diseaseId: number;

    @Column({ name: "zh_name" })
    zhName: string;

    @Column({ name: "en_name" })
    enName: string;

    @Column({ name: "abbr" })
    abbr: string;
}
