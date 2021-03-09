import { Sample } from "./sample.model";

export class Aligned {
    alignedId: number;
    alignmentRate: number;
    meanCoverage: number;
    coverRegionPercentage: number;
    control1: number;
    control2: number;
    control3: number;
    sample: Sample  = new Sample()
}