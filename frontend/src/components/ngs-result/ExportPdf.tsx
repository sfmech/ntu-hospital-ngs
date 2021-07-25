import React, { FunctionComponent } from 'react';
import { Font, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import KAIU from '../../font/KAIU.TTF';
import KAIUBold from '../../font/KAIUBold.TTF';
import TimesNewRoman from '../../font/TimesNewRoman.TTF';
import { Height } from '@material-ui/icons';
import { PdfData } from '../../models/pdf.model';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import { Reference } from '../../models/reference.enum';
import { Sex } from '../../models/sex.enum';
Font.register({ family: 'KAIU', src: KAIU });
Font.register({ family: 'KAIUBold', src: KAIUBold });
Font.register({ family: 'TimesNewRoman', src: TimesNewRoman });
// Create styles
const styles = StyleSheet.create({
	page: {
		flexDirection: 'column',
		fontFamily: 'KAIU',
		paddingLeft: '2.5cm',
		paddingRight: '1cm',
		paddingTop: '1.5cm',
        paddingBottom: '1.5cm'
	},
	titleView: {
		display: 'flex',
		textAlign: 'center',
		fontSize: 12,
		lineHeight: 1.5
	},
	headerView: {
		display: 'flex',
		fontSize: 12
	},
	containView: {
		display: 'flex',
		position: 'relative',
		flexDirection: 'column',
		fontSize: 12,
		padding: 5,
		
	},
    firstBorder:{
        position: 'absolute',
        border: '2px solid black',
        left: '10%',
		right: 0,
		top: '3cm',
        bottom: 0,
        height: 700,
        width: 500,
        backgroundColor:'red'
    },
    border:{
        position: 'absolute',
        border: '2px solid black',
		right: 0,
		top: 0,
        left: 0,
		bottom:'1cm',
    },
	containInfoView: {
		display: 'flex',
		flexDirection: 'row',
		fontSize: 12
	},
	infoView: {
		position: 'absolute',
		fontSize: 10,
		border: '1px solid black',
		paddingTop: 5,
		paddingLeft: 2,
		width: 150,
		height: 50
	},
	table: {
		width: 'auto',
		fontSize: 10,
		borderStyle: 'solid',
		borderWidth: 1,
		borderRightWidth: 0,
		borderBottomWidth: 0
	},
	tableRow: {
		margin: 'auto',
		flexDirection: 'row'
	},
	tableCol: {
		width: '25%',
		borderStyle: 'solid',
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0
	},
	tableCell: {
		margin: 5,
		fontSize: 10
	},
	tableNoteCell: {
		margin: 5,
		fontSize: 10
	},
    pageNumber: {
        position: 'absolute',
        fontSize: 10,
        bottom: 0,
        left: 0,
        right: '1cm',
        top: '1cm',
        textAlign: 'right',
        color: 'grey',
      },
});

type ExportPdfProps = {
	data: PdfData;
	memberlist: HealthCareWorkers[];
};
// Create Document Component
export const MyDocument: FunctionComponent<ExportPdfProps> = (prop) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.headerView}>
				<View style={styles.infoView}>
					<Text>病歷號 : {prop.data.medicalRecordNo}</Text>
					<Text>姓  名 : {prop.data.patientName}</Text>
					<Text>生  日 : 西元 {new Date( prop.data.patientBirth).getFullYear()}年 {new Date( prop.data.patientBirth).getMonth()+1}月 {new Date( prop.data.patientBirth).getDate()}日</Text>
				</View>
				<View style={styles.titleView}>
					<Text>國立臺灣大學醫學院附設醫院</Text>
					<Text style={{fontFamily:"TimesNewRoman"}}>National Taiwan University Hospital</Text>
					<Text style={{ fontSize: 16, fontFamily: 'KAIUBold' }}>次世代定序檢驗報告</Text>
					<Text style={{ fontSize: 16, fontFamily: 'KAIUBold' }}>(檢驗醫學部)</Text>
				</View>
			</View>
            <View style={{position: 'relative'}} render={({ pageNumber }) => (
        		pageNumber === 1 ? (
				<View>
					<View style={{position: 'absolute', top:0,left:0, height:2, width:496, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:0,left:0, height:700, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:0,right:0, height:700, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:700,left:0, height:2, width:496, backgroundColor:'black'}} />
				</View>
        		):(
				<View>
					<View style={{position: 'absolute', top:-3,left:0, height:2, width:496, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:-2,left:0, height:753, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:-2,right:0, height:753, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:750,left:0, height:2, width:496, backgroundColor:'black'}} />
				</View>
		  		)
      		)} fixed />

			<View style={styles.containView}>
				
				<View style={styles.containInfoView}>
					<Text style={{ width: 175 }}>病歷號 : {prop.data.medicalRecordNo}</Text>
					<Text style={{ width: 175 }}>檢體編號 : {prop.data.specimenNo}</Text>
					<Text style={{ width: 175 }}>科分號 : {prop.data.departmentNo}</Text>
				</View>
				<View style={styles.containInfoView}>
					<Text style={{ width: 175 }}>姓名 : {prop.data.patientName}</Text>
					<Text style={{ width: 175 }}>性別 : {Sex[prop.data.patientSex]}</Text>
					<Text style={{ width: 175 }}>出生年月日 : {prop.data.patientBirth}</Text>
				</View>
				<View style={styles.containInfoView}>
					<Text style={{ width: 175 }}>檢查日期 : {prop.data.checkDate}</Text>
					<Text style={{ width: 175 }}>檢體類別 : {prop.data.specimenType}</Text>
					<Text style={{ width: 175 }}>檢體狀態 : {prop.data.specimenStatus}</Text>
				</View>
				<Text>{'\n'}Panel: NTUH LabMed Myeloid Panel</Text>
				<Text>{'\n'}I. Variants with pathogenic relevance:</Text>
				<View style={styles.table} wrap={false}>
					<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '10%' } ]}>
							<Text style={styles.tableCell}>Gene</Text>
						</View>
						<View style={[ styles.tableCol, { width: '15%' } ]}>
							<Text style={styles.tableCell}>Reference</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Nucleotide Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Protein Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>VAF</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>Depth</Text>
						</View>
						<View style={[ styles.tableCol, { width: '21%' } ]}>
							<Text style={styles.tableCell}>Classification</Text>
						</View>
					</View>
					{
						prop.data.list1.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '10%' } ]}>
									<Text style={styles.tableCell}>{element.geneName}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '15%' } ]}>
									<Text style={styles.tableCell}>{Reference[element.geneName]}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSc}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSp}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{parseFloat((element.freq / 100.0).toFixed(2))}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{element.depth}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '21%' } ]}>
									<Text style={styles.tableCell}>{element.clinicalSignificance}</Text>
								</View>
							</View>
						))
					}
					
					<View style={styles.tableRow}>
						<Text style={[ styles.tableCol, { width: '100%', padding: 5 } ]}>
							{' '}
							Note: {prop.data.note1}{' '}
						</Text>
					</View>
				</View>
				<Text>
					{'\n\n'}II. Hotspot variants with low VAF ({'<'}5%):
				</Text>
				<View style={styles.table} wrap={false}>
					<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '10%' } ]}>
							<Text style={styles.tableCell}>Gene</Text>
						</View>
						<View style={[ styles.tableCol, { width: '15%' } ]}>
							<Text style={styles.tableCell}>Reference</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Nucleotide Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Protein Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>VAF</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>Depth</Text>
						</View>
						<View style={[ styles.tableCol, { width: '21%' } ]}>
							<Text style={styles.tableCell}>Classification</Text>
						</View>
					</View>
					{
						prop.data.list2.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '10%' } ]}>
									<Text style={styles.tableCell}>{element.geneName}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '15%' } ]}>
									<Text style={styles.tableCell}>{Reference[element.geneName]}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSc}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSp}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{parseFloat((element.freq / 100.0).toFixed(2))}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{element.depth}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '21%' } ]}>
									<Text style={styles.tableCell}>{element.clinicalSignificance}</Text>
								</View>
							</View>
						))
					}
					<View style={styles.tableRow}>
						<Text style={[ styles.tableCol, { width: '100%', padding: 5 } ]}>
							{' '}
							Note: {prop.data.note2}{' '}
						</Text>
					</View>
				</View>
				<Text>
					{'\n\n'}III. Variants of uncertain significance (VUS):
				</Text>
				<View style={styles.table} wrap={false}>
					<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '10%' } ]}>
							<Text style={styles.tableCell}>Gene</Text>
						</View>
						<View style={[ styles.tableCol, { width: '15%' } ]}>
							<Text style={styles.tableCell}>Reference</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Nucleotide Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%' } ]}>
							<Text style={styles.tableCell}>Protein Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>VAF</Text>
						</View>
						<View style={[ styles.tableCol, { width: '7%' } ]}>
							<Text style={styles.tableCell}>Depth</Text>
						</View>
						<View style={[ styles.tableCol, { width: '21%' } ]}>
							<Text style={styles.tableCell}>Classification</Text>
						</View>
					</View>
					{
						prop.data.list3.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '10%' } ]}>
									<Text style={styles.tableCell}>{element.geneName}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '15%' } ]}>
									<Text style={styles.tableCell}>{Reference[element.geneName]}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSc}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.HGVSp}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{parseFloat((element.freq / 100.0).toFixed(2))}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '7%' } ]}>
									<Text style={styles.tableCell}>{element.depth}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '21%' } ]}>
									<Text style={styles.tableCell}>{element.clinicalSignificance}</Text>
								</View>
							</View>
						))
					}
					<View style={styles.tableRow}>
						<Text style={[ styles.tableCol, { width: '100%', padding: 5 } ]}>
							{' '}
							Note: {prop.data.note3}{' '}
						</Text>
					</View>
				</View>
				<Text>
					{'\n\n'}IV. Methods:
				</Text>
				<Text style={{ marginHorizontal: 5 }}>
                The NTUH LabMed Myeloid NGS is an amplicon-based targeted panel NGS (as 
                detailed below, 26 genes / 119 exons, covering 62.2Kbp genomic region) designed 
                to detect genetic variants in genes that are relevant in myeloid diseases. After 
                library preparation, the genetic materials are sequenced on illumine MiniSeq 
                sequencer, 150 bp paired-end mode. Raw FASTQ files are aligned to human reference 
                genome hg19, and subsequently single-nucleotide variants (SNV) and small 
                insertions/deletions (indel) are detected by Varscan2 (version V2.4.4). 
                Pindel (version 0.2.5b9) is used for detection of large indels ({'>'} 20 bp). 
                Variants are then annotated with SnpEff (version 4.3t), and pathogenicity reporting 
                is guided by the the National Center for Biotechnology Information (NCBI) ClinVar 
                database (version 2018-07-01). 
				</Text>
                <Text>
					{'\n'}
				</Text>
				<View style={styles.table} wrap={false}>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>ASXL1 exon 12</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>IDH2 exon 4</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>TP53 exon 2~9</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>SRSF2 exon 1</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>CARL exon 8,9</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>JAK2 exon 12,14</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>PHF6 exon 2~10</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>TET2 exon 3~9,11</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>CSF3R exon 14~17</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>KIT exon 8,10~12,17</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>PIGA exon 1~6</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>U2AF1 exon 2,6</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>DNMT3A exon 2~24</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>KRAS exon 2,3</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>PTPN11 exon 3,13</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>WT1 exon 2,3,6~9</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>FLT3 exon 14,20</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>MPL exon 10</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>RUNX1 exon 2~9</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>ZRSR2 exon 1~11</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>GATA2 exon 2~6</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>NPM1 exon 11</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>SETBP1 exon 4</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>IDH1 exon 4</Text>
						</View>
					</View>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>NRAS exon 2,3</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>SF3B1 exon 13~16</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}></Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}></Text>
						</View>
					</View>
				</View>

				<Text>
					{'\n\n'}V. Regions with Insufficient Coverage for Evaluation ({'<'}50X){' '}
				</Text>
				<Text>
					In this sample, low-coverage regions ({'<'} 50X) consist {prop.data.coverage}% of all genomic regions targeted by
					this multiplexed NGS assay, and are listed below.{' '}
				</Text>
                <Text>
					{'\n'}
				</Text>
				<View style={styles.table} wrap={false}>
					<View style={styles.tableRow}>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>Gene</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>Exon</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>From (codon)</Text>
						</View>
						<View style={styles.tableCol}>
							<Text style={styles.tableCell}>To (codon)</Text>
						</View>
					</View>
					{
						prop.data.list4.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element.gene}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element.exon}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element.from}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element.to}</Text>
								</View>
							</View>
						))
					}
				</View>
                <Text>
					{'\n\n'}VI. Disclaimer:
				</Text>
                <Text>
                {'\t'}1.	Please note, although the accuracy of this assay has been subjected to stringent clinical validation, false-positive and false-negative results may rarely occur due to suboptimal sample quality or unexpected difficulties in the library preparation and PCR amplification processes. 
                </Text>
                <Text>
                {'\t'}2.	During the development phase of this assay, the limit of detection (LOD) for single nucleotide variants (SNV) was set at 5%, and LOD for insertions/deletions (indel) was set at 10%. Variants below these LOD thresholds are not within the confidence range. In addition, regions with {"<"} 50X coverage may harbor low VAF variants that are below detection limits, and if indicated, the treating physician should consider additional testing tailored to the need of the patient. 
                </Text>
                <Text>
                {'\t'}3.	Hotspot variants with VAF in 3 ~ 5% range, when listed, should be evaluated at the discretion of treating clinician. Variant detection at low frequencies may be due to sample quality, tumor heterogeneity, or other reasons, and should be interpreted with caution.
                </Text>
                <Text>
                {'\t'}4.	Variants of uncertain significance (VUS) are variants that are detected but with insufficient evidence of pathogenicity, especially in the context of hematological malignancies. They are listed in the event that more evidence becomes available at a later time. In addition, knowledge regarding pathogenicity of a variant may change over time, and currently classified benign variants may change in significance at a later time point. 
                </Text>
                <Text>
                {'\t'}5.	A VAF of about 50% can be either somatic or heterozygous germline mutations, and clinical judgement is advised. 
                </Text>
                <Text>
                {'\t'}6.	Structural variants (SV), such as large indels ({">"} 100 bp), duplications, inversions, rearrangement events, and FLT3-ITD are not covered in this test. 
                </Text>
                <Text>
                {'\t'}7.	This report has been correlated with clinical information and other laboratory test results, such as pathology, flow cytometry, when available.
                </Text>
                <Text>
                {'\t'}8.	This test was developed and its performance characteristics determined by the Department of Laboratory Medicine, National Taiwan University Hospital (NTUH). It has not been cleared or approved by the Taiwan Food and Drug Administration (FDA).
				</Text>
                <Text>
					{'\n\n'}VII. References:
				</Text>
                <Text>
                {'\t'}1.	The 2016 revision to the World Health Organization classification of myeloid neoplasms and acute leukemia. Blood. 2016 May 19;127(20):2391-405.
                </Text>
                <Text>
                {'\t'}2.	Genomic and epigenomic landscapes of adult de novo acute myeloid leukemia. N Engl J Med. 2013 May 30;368(22):2059-74.
                </Text>
                <Text>
                {'\t'}3.	Genomic Classification and Prognosis in Acute Myeloid Leukemia. N Engl J Med. 2016 Jun 9;374(23):2209-2221.
                </Text>
                <Text>
                {'\t'}4.	Landscape of genetic lesions in 944 patients with myelodysplastic syndromes. Leukemia. 2014 Feb;28(2):241-7.
                </Text>
                <Text>
                {'\t'}5.	Genetics of MDS. Blood. 2019 Mar 7;133(10):1049-1059.
                </Text>
                <Text>
                {'\t'}6.	Genetic basis and molecular pathophysiology of classical myeloproliferative neoplasms. Blood. 2017 Feb 9;129(6):667-679.
                </Text>
                <Text>
                {'\t'}7.	Classification and Personalized Prognosis in Myeloproliferative Neoplasms. N Engl J Med. 2018 Oct 11;379(15):1416-1430.
                </Text>
                <Text>
                {'\n\n'}
				</Text>
                <View style={styles.containInfoView}>
					<Text style={{ width: 263 }}>品質主管：{prop.memberlist.find((element)=>element.workerId===prop.data.qualityManager)?.name} 醫檢師{'\n'}{'\t\t\t\t\t\t\t\t\t\t'}中檢專字{prop.memberlist.find((element)=>element.workerId===prop.data.qualityManager)?.number}號</Text>
					<Text style={{ width: 263 }}>報告醫師：{prop.memberlist.find((element)=>element.workerId===prop.data.reportDoctor)?.name} 主治醫師{'\n'}{'\t\t\t\t\t\t\t\t\t\t'}中血專字{prop.memberlist.find((element)=>element.workerId===prop.data.reportDoctor)?.number}號</Text>
				</View>
                <Text>
                {'\n'}
				</Text>
                <View style={styles.containInfoView}>
					<Text style={{ width: 263 }}>檢 查 者：{prop.memberlist.find((element)=>element.workerId===prop.data.checker)?.name} 醫檢師{'\n'}{'\t\t\t\t\t\t\t\t\t\t'}中檢專字{prop.memberlist.find((element)=>element.workerId===prop.data.checker)?.number}號</Text>
					<Text style={{ width: 263 }}>確 認 者：{prop.memberlist.find((element)=>element.workerId===prop.data.confirmer)?.name} 主治醫師{'\n'}{'\t\t\t\t\t\t\t\t\t\t'}中血專字{prop.memberlist.find((element)=>element.workerId===prop.data.confirmer)?.number}號</Text>
				</View>
                <Text>
                {'\n'}
				</Text>
                <View style={styles.containInfoView}>
					<Text style={{ width: 263 }}>確認日期：{new Date(Date.now()).toLocaleString().split(" ")[0]}</Text>
				</View>
			</View>
            
            <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `第${pageNumber}頁`
            )} fixed />
		</Page>
	</Document>
);
