import { Disease } from "./disease.model";
import { FileStatus } from "./file.state.enum";

export class File{
    status: FileStatus = FileStatus.NotAnalyse;
    name: string;
    disease: Disease;
}