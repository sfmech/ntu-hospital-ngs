import { Sample } from "./sample.model";

export class Segment {
    segmentId: number;
    sample: Sample = new Sample();
    chr: string;
    position: string;
    dbSNP: string| null;
    freq: number;
    depth: number| null;
    annotation: string;
    geneName: string;
    HGVSc: string;
    HGVSp: string;
    clinicalSignificance: string;
    globalAF: number;
    AFRAF: number;
    AMRAF: number;
    EURAF: number;
    ASNAF: number;
    alert: string;
    remark: string;
    editor: string;
    category: string;
    note: string;

}