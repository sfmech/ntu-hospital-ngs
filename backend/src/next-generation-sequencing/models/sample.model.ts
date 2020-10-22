import { Run } from "./run.model";

export class Sample {
    sampleId: number;
    run: Run;
    chr: string;
    position: string;
    dbSNP: string;
    freq: number;
    depth: number;
    annotation: string;
    geneName: string;
    HGVSp: string;
    clinicalSignificance: string;
    globalAF: number;
    AFRAF: number;
    AMRAF: number;
    EURAF: number;
    ASNAF: number;
}