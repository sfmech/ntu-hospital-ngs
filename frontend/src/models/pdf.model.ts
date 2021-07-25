import { Disease } from "./disease.model";
import { Run } from "./run.model";
import { Sample } from "./sample.model";
import { Segment } from "./segment.model";

export class PdfData {
    runName: string;
    sampleName: string;
    medicalRecordNo: string;
    SID: string;
    departmentNo: string;
    checkDate: string;
    patientBirth : string;
    specimenNo: string;
    patientName: string;
    patientSex : string;
    specimenType : string;
    specimenStatus : string;
    note1 : string;
    note2 : string;
    note3 : string;
    list1 : Segment[];
    list2 : Segment[];
    list3 : Segment[];
    list4 : Array<any>;
    coverage: number;
    checker: number;
    qualityManager: number;
    reportDoctor: number;
    confirmer: number;
    sample: Sample = new Sample();

}