import { Sample } from "./sample.model";

export class MutationQC {
    mutationId: number;
    geneName: string;
    HGVSc: string;
    HGVSp: string;
    cosmic: string;
    chr: string;
    position: string;
    QC: number;
    sample: Sample = new Sample()
}