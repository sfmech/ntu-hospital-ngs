import {
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	FormControl,
	Input,
	makeStyles,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Theme,
	Typography
} from '@material-ui/core';
import { saveAs } from 'file-saver';
import ReactPDF, { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { PdfDataContext } from '../../contexts/pdf-data.context';
import { PdfData } from '../../models/pdf.model';
import { Segment } from '../../models/segment.model';
import { MyDocument } from '../ngs-result/ExportPdf';
import { ExportPdfCollapsibleTable } from '../table/ExportPdfCollapsibleTable';
import { ApiUrl } from '../../constants/constants';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import XLSX from 'xlsx';
import { Sex } from '../../models/sex.enum';
import { keys } from '@material-ui/core/styles/createBreakpoints';
import { HealthCareWorkerRole } from '../../models/healthCareWorker.role.enum';
import { ManualPdfData } from '../../models/manualPdf.model';
import { SpecimenType } from '../../models/specimen.type.enum';
import { SpecimenStatus } from '../../models/specimen.status.enum';
import { Panel } from '../../models/panel.model';
import { ExportManualPdf } from '../ngs-panel-template-managemant/ExportManualPdf';

type ExportManualPdfModalProps = {
	show: boolean;
	data: Array<Panel>;
	panelId: number;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		table: {
			minWidth: 850
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 150
		}
	})
);

export const ExportManualPdfModal: FunctionComponent<ExportManualPdfModalProps> = (props) => {
	const classes = useStyles();
	const [ step, setStep ] = useState<number>(0);
	const [ memberlistgroupbyrole, setMemberlistgroupbyrole ] = useState({ 醫檢師: [], 主治醫師: [] });
	const [memberlist, setMemberlist] = useState<HealthCareWorkers[]>([]);

	const [ pdfData, setPdfData ] = useState<ManualPdfData>(new ManualPdfData());
	const [ bioMarkerList, setBioMarkerList ] = useState([ { id: 1, bioMarker: '', report: '' } ]);
	const [ bioMarkerShowConfirm, setBioMarkerShowConfirm ] = React.useState(false);
	const [ bioMarkerIndex, setBioMarkerIndex ] = React.useState(0);

	const [ genomicList, setGenomicList ] = useState([
		{
			id: 1,
			gene: '',
			reference: '',
			nucleotideChange: '',
			proteinChange: '',
			VAF: ''
		}
	]);
	const [ genomicShowConfirm, setGenomicShowConfirm ] = React.useState(false);
	const [ genomicIndex, setGenomicIndex ] = React.useState(0);
	const [ panel, setPanel ] = React.useState<Panel>(new Panel());

	const [ variantList, setVariantList ] = useState([ { id: 1, gene: '', proteinChange: '' } ]);
	const [ variantShowConfirm, setVariantShowConfirm ] = React.useState(false);
	const [ variantIndex, setVariantIndex ] = React.useState(0);

	useEffect(
		() => {
			setStep(0);
			const getMemberlist = () => {
				try {
					axios(`${ApiUrl}/api/getHealthCareWorkers`).then((res) => {
						const memberlistgroupbyrole = res.data.reduce((groups, item) => {
							const val = item.role;
							groups[val] = groups[val] || [];
							groups[val].push(item);
							return groups;
						}, {});
						setMemberlistgroupbyrole(memberlistgroupbyrole);
						setMemberlist(res.data);

					});
				} catch (error) {
					console.log(error);
				}
			};
			getMemberlist();
			setPdfData(new ManualPdfData());
			
			setBioMarkerList([ { id: 1, bioMarker: '', report: '' } ]);
			setBioMarkerShowConfirm(false);
			setGenomicList([
				{
					id: 1,
					gene: '',
					reference: '',
					nucleotideChange: '',
					proteinChange: '',
					VAF: ''
				}
			]);
			setGenomicShowConfirm(false);
			setVariantList([ { id: 1, gene: '', proteinChange: '' } ]);
			setVariantShowConfirm(false);
			setPanel(props.data.filter((panel)=>panel.panelId===props.panelId)[0]);
		},
		[ props.show ]
	);
	const handleSampleChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		let temp = Object.assign(new ManualPdfData(), pdfData);
		temp[name] = value;
		setPdfData(temp);
	};
	const handleBiomarkerChange = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;
		const list = [ ...bioMarkerList ];
		list[index][name] = value;
		setBioMarkerList(list);
	};

	const handleBioMarkerAdd = () => {
		setBioMarkerList([
			...bioMarkerList,
			{
				id: bioMarkerList.length + 1,
				bioMarker: '',
				report: ''
			}
		]);
	};
	const handleBioMarkerConfirm = (i) => {
		setBioMarkerIndex(i);
		setBioMarkerShowConfirm(true);
	};

	const handleBioMarkerRemoveClick = (i) => {
		console.log(i);
		const list = [ ...bioMarkerList ];
		list.splice(i, 1);
		setBioMarkerList(list);
		setBioMarkerShowConfirm(false);
	};

	const handleBioMarkerNo = () => {
		setBioMarkerShowConfirm(false);
	};

	const handleGenomicChange = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;
		const list = [ ...genomicList ];
		list[index][name] = value;
		setGenomicList(list);
	};

	const handleGenomicAdd = () => {
		setGenomicList([
			...genomicList,
			{
				id: genomicList.length + 1,
				gene: '',
				reference: '',
				nucleotideChange: '',
				proteinChange: '',
				VAF: ''
			}
		]);
	};
	const handleGenomicConfirm = (i) => {
		setGenomicIndex(i);
		setGenomicShowConfirm(true);
	};

	const handleGenomicRemoveClick = (i) => {
		console.log(i);
		const list = [ ...genomicList ];
		list.splice(i, 1);
		setGenomicList(list);
		setGenomicShowConfirm(false);
	};

	const handleGenomicNo = () => {
		setGenomicShowConfirm(false);
	};

	const handleVariantChange = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;
		const list = [ ...variantList ];
		list[index][name] = value;
		setVariantList(list);
	};

	const handleVariantAdd = () => {
		setVariantList([
			...variantList,
			{
				id: variantList.length + 1,
				gene: '',
				proteinChange: ''
			}
		]);
	};
	const handleVariantConfirm = (i) => {
		setVariantIndex(i);
		setVariantShowConfirm(true);
	};

	const handleVariantRemoveClick = (i) => {
		console.log(i);
		const list = [ ...variantList ];
		list.splice(i, 1);
		setVariantList(list);
		setVariantShowConfirm(false);
	};

	const handleVariantNo = () => {
		setVariantShowConfirm(false);
	};

	const handleDownloadPdf = () => {
		
		props.onClose();
	};

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>{panel===undefined?"":panel.panelName}</DialogTitle>
			<DialogContent dividers>
			<div className="row">
					<div className="row col-4">
						<div className="col-6 text-right">病歷號:</div>
						<div className="col-6">
							<Input value={pdfData.medicalRecordNo} name={'medicalRecordNo'} onChange={handleSampleChange} />
						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">科分號:</div>
						<div className="col-6">
						<Input value={pdfData.departmentNo} name={'departmentNo'} onChange={handleSampleChange} />

						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">檢查日期:</div>
						<div className="col-6">
						<TextField
								name="checkDate"
								type="date"
								value={`${new Date(pdfData.checkDate).getFullYear()}-${new Date(
									pdfData.checkDate
								).getMonth() > 8
									? new Date(pdfData.checkDate).getMonth() + 1
									: '0' + (new Date(pdfData.checkDate).getMonth() + 1)}-${new Date(
									pdfData.checkDate
								).getDate() > 9
									? new Date(pdfData.checkDate).getDate()
									: '0' + new Date(pdfData.checkDate).getDate()}`}
								onChange={(e) => handleSampleChange(e)}
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
							/>
						</div>
					</div>
				</div>
				<div className="row mt-2">
					<div className="row col-4">
						<div className="col-6 text-right">檢體編號:</div>
						<div className="col-6">
							<Input value={pdfData.specimenNo} name={'specimenNo'} onChange={handleSampleChange} />
						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">檢體類別:</div>
						<div className="col-6">
							<FormControl variant="outlined">
								<Select
									labelId="demo-simple-select-outlined-label2"
									value={pdfData.specimenType}
									name={'specimenType'}
									onChange={handleSampleChange}
								>
									{Object.keys(SpecimenType).map((result) => {
										return <MenuItem value={SpecimenType[result]}>{SpecimenType[result]}</MenuItem>;
									})}
								</Select>
							</FormControl>
						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">檢體狀態:</div>
						<div className="col-6">
							<FormControl variant="outlined">
								<Select
									labelId="demo-simple-select-outlined-label2"
									value={pdfData.specimenStatus}
									name={'specimenStatus'}
									onChange={handleSampleChange}
								>
									{Object.keys(SpecimenStatus).map((result) => {
										return (
											<MenuItem value={SpecimenStatus[result]}>{SpecimenStatus[result]}</MenuItem>
										);
									})}
								</Select>
							</FormControl>
						</div>
					</div>
				</div>
				<div className="row mt-2">
					<div className="row col-4">
						<div className="col-6 text-right">姓名:</div>
						<div className="col-6">
							<Input value={pdfData.patientName} name={'patientName'} onChange={handleSampleChange} />
						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">性別:</div>
						<div className="col-6">
							<FormControl variant="outlined">
								<Select
									labelId="demo-simple-select-outlined-label2"
									value={pdfData.patientSex}
									name={'patientSex'}
									onChange={handleSampleChange}
								>
									{Object.keys(Sex).map((result) => {
										return <MenuItem value={Sex[result]}>{Sex[result]}</MenuItem>;
									})}
								</Select>
							</FormControl>
						</div>
					</div>
					<div className="row col-4">
						<div className="col-6 text-right">出生年月日:</div>
						<div className="col-6">
							<TextField
								name="patientBirth"
								type="date"
								value={`${new Date(pdfData.patientBirth).getFullYear()}-${new Date(
									pdfData.patientBirth
								).getMonth() > 8
									? new Date(pdfData.patientBirth).getMonth() + 1
									: '0' + (new Date(pdfData.patientBirth).getMonth() + 1)}-${new Date(
									pdfData.patientBirth
								).getDate() > 9
									? new Date(pdfData.patientBirth).getDate()
									: '0' + new Date(pdfData.patientBirth).getDate()}`}
								onChange={(e) => handleSampleChange(e)}
								className={classes.textField}
								InputLabelProps={{
									shrink: true
								}}
							/>
						</div>
					</div>
				</div>
				<div className="row mt-2">
					
					<div className="row col-6">
						<div className="col-6 text-right">報告醫師:</div>
						<div className="col-6">
							<FormControl variant="outlined">
								<Select
									labelId="demo-simple-select-outlined-label2"
									value={pdfData.reportDoctor}
									name={'reportDoctor'}
									onChange={handleSampleChange}
								>
									{memberlistgroupbyrole[HealthCareWorkerRole['VS']] !== undefined ? (
										memberlistgroupbyrole[
											HealthCareWorkerRole['VS']
										].map((result: HealthCareWorkers) => {
											return <MenuItem value={result.workerId}>{result.name}</MenuItem>;
										})
									) : null}
								</Select>
							</FormControl>
						</div>
					</div>
				</div>
				
				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					I. Biomarker Findings
				</Typography>
				<div className="row">
					<Button className="ml-2" variant="outlined" onClick={handleBioMarkerAdd}>
						<AddBoxIcon onClick={handleBioMarkerAdd} />
						ADD
					</Button>
				</div>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Biomarker</TableCell>
							<TableCell>Report</TableCell>
							<TableCell align="center">Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{bioMarkerList.map((row, i) => {
							return (
								<TableRow>
									<TableCell>
										<input
											value={row.bioMarker}
											name="bioMarker"
											onChange={(e) => handleBiomarkerChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input
											value={row.report}
											name="report"
											onChange={(e) => handleBiomarkerChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<Button onClick={() => handleBioMarkerConfirm(i)}>
											<DeleteOutlineIcon />
										</Button>
									</TableCell>

									{bioMarkerShowConfirm && (
										<div>
											<Dialog
												open={bioMarkerShowConfirm}
												onClose={handleBioMarkerNo}
												aria-labelledby="alert-dialog-title"
												aria-describedby="alert-dialog-description"
											>
												<DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
												<DialogContent>
													<DialogContentText id="alert-dialog-description">
														Are you sure to delete
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button
														onClick={() => handleBioMarkerRemoveClick(bioMarkerIndex)}
														color="primary"
														autoFocus
													>
														Yes
													</Button>
													<Button onClick={handleBioMarkerNo} color="primary" autoFocus>
														No
													</Button>
												</DialogActions>
											</Dialog>
										</div>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					II. Genomic Findings
				</Typography>
				<div className="row">
					<Button className="ml-2" variant="outlined" onClick={handleGenomicAdd}>
						<AddBoxIcon onClick={handleGenomicAdd} />
						ADD
					</Button>
				</div>
				<Table aria-label="simple table">
					<caption>{panel===undefined?"":panel.note1}</caption>
					<TableHead>
						<TableRow>
							<TableCell>Gene</TableCell>
							<TableCell>Reference</TableCell>
							<TableCell>Nucleotide Change</TableCell>
							<TableCell>Protein Change</TableCell>
							<TableCell>VAF ({'%'})</TableCell>
							<TableCell align="center">Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{genomicList.map((row, i) => {
							return (
								<TableRow>
									<TableCell>
										<input
											value={row.gene}
											name="gene"
											onChange={(e) => handleGenomicChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input
											value={row.reference}
											name="reference"
											onChange={(e) => handleGenomicChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input
											value={row.nucleotideChange}
											name="nucleotideChange"
											onChange={(e) => handleGenomicChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input
											value={row.proteinChange}
											name="proteinChange"
											onChange={(e) => handleGenomicChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input value={row.VAF} name="VAF" onChange={(e) => handleGenomicChange(e, i)} />
									</TableCell>
									<TableCell>
										<Button onClick={() => handleGenomicConfirm(i)}>
											<DeleteOutlineIcon />
										</Button>
									</TableCell>

									{genomicShowConfirm && (
										<div>
											<Dialog
												open={genomicShowConfirm}
												onClose={handleGenomicNo}
												aria-labelledby="alert-dialog-title"
												aria-describedby="alert-dialog-description"
											>
												<DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
												<DialogContent>
													<DialogContentText id="alert-dialog-description">
														Are you sure to delete
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button
														onClick={() => handleGenomicRemoveClick(genomicIndex)}
														color="primary"
														autoFocus
													>
														Yes
													</Button>
													<Button onClick={handleGenomicNo} color="primary" autoFocus>
														No
													</Button>
												</DialogActions>
											</Dialog>
										</div>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>

				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					III. Variants of Unknown Significance
				</Typography>
				<div className="row">
					<Button className="ml-2" variant="outlined" onClick={handleVariantAdd}>
						<AddBoxIcon onClick={handleVariantAdd} />
						ADD
					</Button>
				</div>
				<Table aria-label="simple table">
					<caption>{panel===undefined?"":panel.note2}</caption>
					<TableHead>
						<TableRow>
							<TableCell>Gene</TableCell>
							<TableCell>Protein Change</TableCell>
							<TableCell align="center">Delete</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{variantList.map((row, i) => {
							return (
								<TableRow>
									<TableCell>
										<input
											value={row.gene}
											name="gene"
											onChange={(e) => handleVariantChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<input
											value={row.proteinChange}
											name="proteinChange"
											onChange={(e) => handleVariantChange(e, i)}
										/>
									</TableCell>
									<TableCell>
										<Button onClick={() => handleVariantConfirm(i)}>
											<DeleteOutlineIcon />
										</Button>
									</TableCell>

									{variantShowConfirm && (
										<div>
											<Dialog
												open={variantShowConfirm}
												onClose={handleVariantNo}
												aria-labelledby="alert-dialog-title"
												aria-describedby="alert-dialog-description"
											>
												<DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
												<DialogContent>
													<DialogContentText id="alert-dialog-description">
														Are you sure to delete
													</DialogContentText>
												</DialogContent>
												<DialogActions>
													<Button
														onClick={() => handleVariantRemoveClick(variantIndex)}
														color="primary"
														autoFocus
													>
														Yes
													</Button>
													<Button onClick={handleVariantNo} color="primary" autoFocus>
														No
													</Button>
												</DialogActions>
											</Dialog>
										</div>
									)}
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					IV. Methods
					<div style={{whiteSpace: 'pre-wrap'}}>
						{panel===undefined?"":panel.methods}
					</div>
				</Typography>
				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					Gene List
				</Typography>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell>Gene</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{panel===undefined || panel.genesMethods===undefined?"":panel.genesMethods.map((row, i) => {
							return (
								<TableRow>
									<TableCell>
										{row}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
				<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					V. Technical Notes
					<div style={{whiteSpace: 'pre-wrap'}}>
						{panel===undefined?"":panel.technicalNotes}
					</div>
				</Typography>
			</DialogContent>
			<DialogActions>
			
				<Button variant="contained" color="primary" onClick={handleDownloadPdf}>
				<PDFDownloadLink style={{color: 'white'}} document={<ExportManualPdf panel={panel}
			bioMarkerList={bioMarkerList}
			genomicList={genomicList}
			variantList={variantList}
			data={pdfData}
			memberlist={memberlist} />} fileName={`${panel===undefined?"panel":panel.panelName}.pdf`}>
			{({ blob, url, loading, error }) => (loading ? 'Loading document...' : '匯出')}
			</PDFDownloadLink>
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
