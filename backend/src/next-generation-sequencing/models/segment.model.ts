import { Sample } from "./sample.model";

export class Segment {
    segmentId: number;
    sample: Sample = new Sample()
    chr: string| null;
    position: string| null;
    dbSNP: string| null;
    freq: number| null;
    depth: number| null;
    annotation: string| null;
    geneName: string| null;
    HGVSc: string| null;
    HGVSp: string| null;
    clinicalSignificance: string| null;
    globalAF: number| null;
    AFRAF: number | null;
    AMRAF: number| null;
    EURAF: number| null;
    ASNAF: number| null;
    category: string;
    note: string;
    isDeleted: boolean;

}