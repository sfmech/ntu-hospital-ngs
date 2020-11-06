import { Run } from "./run.model";

export class Sample {
    sampleId: number;
    sampleName: string;
    disease: string;
    run: Run = new Run();

}