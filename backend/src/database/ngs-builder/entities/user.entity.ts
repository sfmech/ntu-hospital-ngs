import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany } from "typeorm";

@Entity({ database: "NTU_Hospital_NGS", name: "users" })
export class User {
    @PrimaryGeneratedColumn({ name: "user_id" })
    userId: number;

    @Column({ name: "user_name" })
    userName: string;

    @Column({ name: "password" })
    password: string;

    @Column({ name: "user_role" })
    userRole: string;

}
