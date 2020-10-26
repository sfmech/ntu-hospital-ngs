import { Sample } from "./sample.model";

export class Segment {
    segmentId: number;
    sample: Sample
    chr: string;
    position: string;
    dbSNP: string| null;
    freq: number| null;
    depth: number| null;
    annotation: string| null;
    geneName: string| null;
    HGVSc: string;
    HGVSp: string;
    clinicalSignificance: string;
    globalAF: number;
    AFRAF: number;
    AMRAF: number;
    EURAF: number;
    ASNAF: number;
}