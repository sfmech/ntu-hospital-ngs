import { Entity, Column, CreateDateColumn, PrimaryGeneratedColumn, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Aligned } from "./aligned.entity";
import { Coverage } from "./coverage.entity";
import { Disease } from "./disease.entity";
import { MutationQC } from "./mutationQC.entity";
import { Run } from "./run.entity";
import { Segment } from "./segment.entity";

@Entity({ database: "NTU_Hospital_NGS", name: "panels" })
export class Panel {
    @PrimaryGeneratedColumn({ name: "panel_id" })
    panelId: number;

    @Column({ name: "panel_name" })
    panelName: string;


    @Column({ name: "note1"})
    note1 : string;
    
    @Column({ name: "note2"})
    note2 : string;

    @Column({ name: "text_methods"})
    methods : string;

    @Column({ name: "text_technical_notes"})
    technicalNotes : string;
   
    @Column("text",{ name: "genes_methods", array: true })
    genesMethods: string[];

    @Column("text",{ name: "biomarker", array: true })
    biomarker: string[];
}
