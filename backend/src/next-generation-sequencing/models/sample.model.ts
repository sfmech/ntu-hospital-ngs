import { Disease } from "./disease.model";
import { Run } from "./run.model";

export class Sample {
    sampleId: number;
    sampleName: string;
    disease: Disease;
    run: Run = new Run();
    medicalRecordNo: string;
    SID: string;
    departmentNo: string;
    checkDate: Date;
    patientBirth : Date;
    specimenNo: string;
    patientName: string;
    patientSex : string;
    specimenType : string;
    specimenStatus : string;
    note1 : string;
    note2 : string;
    note3 : string;
    checker: number;
    qualityManager: number;
    reportDoctor: number;
    confirmer: number;
    totalReads: number;
    Q20Bases: number;
    Q30Bases: number;
    duplicationRate: number;
    GCContent: number;
    bed: string;
}