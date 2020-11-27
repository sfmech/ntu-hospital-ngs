import { Disease } from "./disease.model";
import { Run } from "./run.model";

export class Sample {
    sampleId: number;
    sampleName: string;
    disease: Disease;
    run: Run = new Run();

}