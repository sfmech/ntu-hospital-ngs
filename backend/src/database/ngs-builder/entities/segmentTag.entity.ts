import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from "typeorm";

@Entity({ database: "NTU_Hospital_NGS", name: "filterlist" })
export class SegmentTag {

    @PrimaryColumn({ name: "chr" })
    chr: string;

    @PrimaryColumn({ name: "position" })
    position: string;

    @PrimaryColumn({ name: "HGVS.p" })
    HGVSp: string;

    @PrimaryColumn({ name: "HGVS.c" })
    HGVSc: string;

    @Column({ name: "category" })
    category: string;

    @Column({ name: "gene_name" })
    geneName: string;

    @Column({ name: "remark" })
    remark: string;

    @Column({ name: "editor" })
    editor: string;

    @Column({ name: "clinical_significance" })
    clinicalSignificance: string;
}
