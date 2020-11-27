import { Disease } from "./disease.model";
import { Run } from "./run.model";

export class Sample {
    sampleId: number;
    sampleName: string;
    run: Run = new Run();
    disease: Disease;
}