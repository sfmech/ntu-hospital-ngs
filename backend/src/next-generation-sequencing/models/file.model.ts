import { Disease } from "./disease.model";
import { FileStatus } from "./file.state.enum";

export class File{
    status: FileStatus = FileStatus.NotAnalyse;
    name: string;
    SID: string="";
    medicalRecordNo: string="";
    departmentNo: string="";
    checkDate: Date= new Date(Date.now());
    disease: Disease;
}