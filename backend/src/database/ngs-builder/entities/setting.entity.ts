import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany } from "typeorm";

@Entity({ database: "NTU_Hospital_NGS", name: "setting" })
export class Setting {
    @PrimaryGeneratedColumn({ name: "id" })
    id: number;

    @Column({ name: "name" })
    name: string;

    @Column({ name: "value" })
    value: string;



}
