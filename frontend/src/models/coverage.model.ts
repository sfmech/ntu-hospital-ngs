import { Sample } from "./sample.model";

export class Coverage {
    coverageId: number;
    chr: string;
    ampliconStart: string;
    ampliconEnd: string;
    amplionName: string;
    amplion_mean_coverge: number;
    sample: Sample = new Sample()
}