import React, { FunctionComponent } from 'react';
import { Font, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import KAIU from '../../font/KAIU.TTF';
import KAIUBold from '../../font/KAIUBold.TTF';
import TimesNewRoman from '../../font/TimesNewRoman.TTF';
import TimesNewRomanBold from '../../font/TimesNewRomanBold.TTF';
import { Height } from '@material-ui/icons';
import { PdfData } from '../../models/pdf.model';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import { Reference } from '../../models/reference.enum';
import { Sex } from '../../models/sex.enum';
import { ManualPdfData } from '../../models/manualPdf.model';
import { Panel } from '../../models/panel.model';

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
	footerView: {
		position: 'absolute',
		flexDirection: 'row',
		fontSize: 10,
		bottom: '0.3cm',
		left: '1cm'
	},
	footerVersionView: {
		display: 'flex',
		position: 'absolute',
		flexDirection: 'row',
		fontSize: 10,
		bottom: '0.3cm',
		right: '0.8cm'
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
		fontFamily: 'TimesNewRoman',
		padding: 5,
	},
	containInfoView: {
		display: 'flex',
		flexDirection: 'row',
		fontSize: 12
	},
	infoView: {
		display: 'flex',
		flexDirection: 'row',
		fontSize: 10,
	},
	table: {
		width: 'auto',
		fontSize: 11,
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
		justifyContent: 'center',
		borderStyle: 'solid',
		borderWidth: 1,
		borderLeftWidth: 0,
		borderTopWidth: 0
	},
	tableCell: {
		margin: 2,
		fontSize: 10
	},
	tableNoteCell: {
		margin: 5,
		fontSize: 10
	},
    pageNumber: {
        position: 'absolute',
        fontSize: 11,
        bottom: 0,
        left: 0,
        right: '1cm',
        top: '4.44cm',
        textAlign: 'right',

      },
});

type ExportPdfProps = {
	data: ManualPdfData;
	panel: Panel;
	bioMarkerList;
	genomicList;
	variantList;
	memberlist: HealthCareWorkers[];
};
const chunk = (a,n)=>[...Array(Math.ceil(a.length/n))].map((_,i)=>a.slice(n*i,n+n*i));

// Create Document Component
export const ExportManualPdf: FunctionComponent<ExportPdfProps> = (prop) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `第${pageNumber}頁`
            )} fixed />
			<View style={styles.headerView} fixed>
				<View style={styles.titleView}>
					<Text>國 立 臺 灣 大 學 醫 學 院 附 設 醫 院</Text>
					<Text style={{fontFamily:"TimesNewRoman"}}>National Taiwan University Hospital</Text>
					<Text style={{ fontSize: 16, fontFamily: 'KAIUBold' }}>次世代定序檢驗報告</Text>
					<Text style={{ fontSize: 16, fontFamily: 'KAIUBold' }}>(檢驗醫學部)</Text>
				</View>
				<View style={styles.infoView}>
					<Text style={{ fontSize: 11, width: 150 }}>病歷號 : {prop.data.medicalRecordNo}</Text>
					<Text style={{ fontSize: 11, width: 150 }}>姓名 : {prop.data.patientName}</Text>
					<Text style={{ fontSize: 11 }}>生日 : 西元 {new Date( prop.data.patientBirth).getFullYear()}年 {new Date( prop.data.patientBirth).getMonth()+1}月 {new Date( prop.data.patientBirth).getDate()}日</Text>
				</View>
				<Text>{'\n'}</Text>
			</View>
            <View style={{position: 'relative'}} fixed >
				<View>
					<View style={{position: 'absolute', top:-10,left:0, height:2, width:496, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:-10,left:0, height:660, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:-10,right:0, height:660, width:2, backgroundColor:'black'}} />
					<View style={{position: 'absolute', top:650,left:0, height:2, width:496, backgroundColor:'black'}} />
				</View>
			</View>

			<View style={styles.containView}>
				<View style={styles.containInfoView}>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>檢查日期 : {`${new Date(prop.data.checkDate).getFullYear()}/${(new Date(prop.data.checkDate).getMonth() > 8) ? (new Date(prop.data.checkDate).getMonth() + 1) : ('0' + (new Date(prop.data.checkDate).getMonth() + 1))}/${(new Date(prop.data.checkDate).getDate() > 9) ? new Date(prop.data.checkDate).getDate() : ('0' + new Date(prop.data.checkDate).getDate())}`}</Text>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>檢體編號 : {prop.data.specimenNo}</Text>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>科分號 : {prop.data.departmentNo}</Text>
				</View>
				<View style={styles.containInfoView}>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>性別 : {prop.data.patientSex}</Text>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>檢體類別 : {prop.data.specimenType}</Text>
					<Text style={{ width: 175, fontFamily: 'KAIU' }}>檢體狀態 : {prop.data.specimenStatus}</Text>
				</View>
				<View style={styles.containInfoView}>
					<Text style={{fontFamily: 'TimesNewRomanBold'}}>{'\n'}Panel: </Text>
					<Text>{'\n'} {prop.panel.panelName}</Text>
				</View>
				
				<Text style={{fontFamily: 'TimesNewRomanBold'}}>{'\n'}I. Biomarker Findings:</Text>
				<View style={styles.table} wrap={true}>
					<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '50%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Biomarker</Text>
						</View>
						<View style={[ styles.tableCol, { width: '50%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Report</Text>
						</View>
						
					</View>
					{
						prop.bioMarkerList.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '50%' } ]}>
									<Text style={styles.tableCell}>{element.bioMarker}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '50%' } ]}>
									<Text style={styles.tableCell}>{element.report}</Text>
								</View>
							</View>
						))
					}
					
					
				</View>
				<Text style={{fontFamily: 'TimesNewRomanBold'}}>
					{'\n\n'}II. Genomic Findings:
				</Text>
				<View style={styles.table} wrap={true}>
					<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '10%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Gene</Text>
						</View>
						<View style={[ styles.tableCol, { width: '20%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Reference</Text>
						</View>
						<View style={[ styles.tableCol, { width: '35%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Nucleotide Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '25%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Protein Change</Text>
						</View>
						<View style={[ styles.tableCol, { width: '10%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>VAF</Text>
						</View>
					</View>
					{
						prop.genomicList.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '10%' } ]}>
									<Text style={styles.tableCell}>{element.gene}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '20%' } ]}>
									<Text style={styles.tableCell}>{element.reference}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '35%' } ]}>
									<Text style={styles.tableCell}>{element.nucleotideChange}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element.proteinChange}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '10%' } ]}>
									<Text style={styles.tableCell}>{element.VAF}</Text>
								</View>
							</View>
						))
					}
					<View style={styles.tableRow}>
						<Text style={[ styles.tableCol, { width: '100%', padding: 5 } ]}>
							{' '}
							{prop.panel.note1}{' '}
						</Text>
					</View>
				</View>
				<Text style={{ fontFamily: 'TimesNewRomanBold'}}>
					{'\n\n'}III. Variants of Unknown Significance:
				</Text>
				<View style={styles.table} wrap={true}>
				<View style={styles.tableRow}>
						<View style={[ styles.tableCol, { width: '50%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Gene</Text>
						</View>
						<View style={[ styles.tableCol, { width: '50%', alignItems: 'center' } ]}>
							<Text style={{...styles.tableCell, fontFamily: 'TimesNewRomanBold'}}>Protein Change</Text>
						</View>
						
					</View>
					{
						prop.variantList.map((element)=>(
							<View style={styles.tableRow}>
								<View style={[ styles.tableCol, { width: '50%' } ]}>
									<Text style={styles.tableCell}>{element.gene}</Text>
								</View>
								<View style={[ styles.tableCol, { width: '50%' } ]}>
									<Text style={styles.tableCell}>{element.proteinChange}</Text>
								</View>
							</View>
						))
					}
				</View>
				<Text>
							{' '}
							 {prop.panel.note2}{' '}
						</Text>
				<Text style={{ fontFamily: 'TimesNewRomanBold'}}>
					{'\n\n'}IV. Methods:
				</Text>
				<Text style={{ marginHorizontal: 5 }}>
					{prop.panel.methods}
				</Text>
                <Text>
					{'\n'}
				</Text>
				<View style={styles.table} wrap={true}>
				
					{
						chunk(prop.panel.genesMethods,4).map((elements, index)=>(
							<View style={styles.tableRow}>
							{elements.map((element)=>(
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}>{element}</Text>
								</View>
							))}
							{
							
							elements.length%4!==0?new Array(4-elements.length).fill(0).map((empty)=>(
								<View style={[ styles.tableCol, { width: '25%' } ]}>
									<Text style={styles.tableCell}></Text>
								</View>
							)):null}
							</View>
							
						))
					}				
					
				</View>

				
                <Text style={{ fontFamily: 'TimesNewRomanBold'}}>
					{'\n\n'}V. Technical Notes:
				</Text>
                <Text>
                {prop.panel.technicalNotes}
                </Text>
                <Text>
                {'\n\n'}
				</Text>
                <View style={styles.containInfoView}>
					<Text style={{ width: 263, fontFamily: 'KAIU' }}>報告醫師：{prop.memberlist.find((element)=>element.workerId===prop.data.reportDoctor)?.name} 主治醫師{'\n'}{'\t\t\t\t\t\t\t\t\t\t'}{prop.memberlist.find((element)=>element.workerId===prop.data.reportDoctor)?.number}</Text>
				</View>
                <Text>
                {'\n'}
				</Text>
                
                <View style={styles.containInfoView}>
					<Text style={{ width: 263, fontFamily: 'KAIU' }}>確認日期：{`${new Date(Date.now()).getFullYear()}/${(new Date(Date.now()).getMonth() > 8) ? (new Date(Date.now()).getMonth() + 1) : ('0' + (new Date(Date.now()).getMonth() + 1))}/${(new Date(Date.now()).getDate() > 9) ? new Date(Date.now()).getDate() : ('0' + new Date(Date.now()).getDate())}`}</Text>
				</View>
			</View>
			<View style={styles.footerView} fixed>
				<Text style={{marginTop:8}}>西元2021年07月29日病歷委員會審核通過電子病歷版本 MR 08-13-39</Text>
				<View style={{...styles.table, width:210, marginLeft:2}}>
					<View style={styles.tableRow}>
						<View style={{...styles.tableCol, width: '25%'}}>
							<Text style={{...styles.tableCell, textAlign: 'center'}}>文件編號</Text>
						</View>
						<View style={{...styles.tableCol, width: '41%'}}>
							<Text style={{...styles.tableCell, textAlign: 'center'}}>01400-4-602666</Text>
						</View>
						<View style={{...styles.tableCol, width: '17%'}}>
							<Text style={{...styles.tableCell, textAlign: 'center'}}>版次</Text>
						</View>
						<View style={{...styles.tableCol, width: '17%'}}>
							<Text style={{...styles.tableCell, textAlign: 'center'}}>01</Text>
						</View>
					</View>
				</View>
			</View>
			<View style={styles.footerVersionView} fixed>
				<Text style={{marginLeft:2, fontSize:20, borderStyle: 'solid', borderWidth: 2, borderRadius: "50%", height:25, width:25, textAlign:'center', paddingTop:2}}>3</Text>
			</View>
            

		</Page>
	</Document>
);
