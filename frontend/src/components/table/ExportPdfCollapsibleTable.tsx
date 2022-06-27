import React, { FunctionComponent, useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { MutationQC } from '../../models/mutationQC.model';
import {
	createStyles,
	FormControl,
	Input,
	MenuItem,
	Select,
	TableSortLabel,
	TextField,
	Theme,
	Toolbar
} from '@material-ui/core';
import { Sample } from '../../models/sample.model';
import { Segment } from '../../models/segment.model';
import { SpecimenType } from '../../models/specimen.type.enum';
import { SpecimenStatus } from '../../models/specimen.status.enum';
import { useEffect } from 'react';
import { PdfData } from '../../models/pdf.model';
import { Sex } from '../../models/sex.enum';
import { PdfDataContext } from '../../contexts/pdf-data.context';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import { HealthCareWorkerRole } from '../../models/healthCareWorker.role.enum';
import { Reference } from '../../models/reference.enum';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === 'desc'
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator: (a, b) => number) {
	const stabilizedThis = array.map((el, index) => [ el, index ]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			width: '100%',
			marginBottom: theme.spacing(2)
		},
		table: {
			minWidth: 1090
		},
		visuallyHidden: {
			border: 0,
			clip: 'rect(0 0 0 0)',
			height: 1,
			margin: -1,
			overflow: 'hidden',
			padding: 0,
			position: 'absolute',
			top: 20,
			width: 1
		},
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		}
	})
);

const useRowStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& > *': {
				borderBottom: 'unset'
			}
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200
		},
		title: {
			flex: '1 1 100%'
		}
	})
);
interface HeadCell {
	disablePadding: boolean;
	id: keyof MutationQC;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'chr', numeric: true, disablePadding: false, label: 'Chr' },
	{ id: 'position', numeric: true, disablePadding: false, label: 'Position' },
	{ id: 'cosmic', numeric: true, disablePadding: false, label: 'Cosmic' },
	{ id: 'HGVSc', numeric: true, disablePadding: false, label: 'HGVS.c' },
	{ id: 'HGVSp', numeric: true, disablePadding: false, label: 'HGVS.p' },
	{ id: 'QC', numeric: true, disablePadding: false, label: 'QC' }
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof MutationQC) => void;
	order: Order;
	orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = (property: keyof MutationQC) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell
						key={headCell.id}
						align={headCell.numeric ? 'right' : 'left'}
						padding={headCell.disablePadding ? 'none' : 'default'}
						sortDirection={orderBy === headCell.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : 'asc'}
							onClick={createSortHandler(headCell.id)}
						>
							{headCell.label}
							{orderBy === headCell.id ? (
								<span className={classes.visuallyHidden}>
									{order === 'desc' ? 'sorted descending' : 'sorted ascending'}
								</span>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
}

function Row(props: { row: PdfData; index: number, memberlist }) {
	const { row, index, memberlist } = props;
	const [ open, setOpen ] = React.useState(false);
	const classes = useRowStyles();
	const { pdfData, setData } = useContext(PdfDataContext);

	

	const handleSampleChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		row[name] = value;
		pdfData[index][name] = value;
		pdfData[index].sample[name] = value;
		setData(pdfData);
	};

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>{row.SID}</TableCell>
				<TableCell>{row.runName}</TableCell>
				<TableCell>{row.sampleName}</TableCell>
				<TableCell>{row.medicalRecordNo}</TableCell>
				<TableCell>{row.departmentNo}</TableCell>
				<TableCell>{row.checkDate}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<div className="row">
								<div className="row col-4">
									<div className="col-6 text-right">檢體編號:</div>
									<div className="col-6">
										<Input
											value={row.specimenNo}
											name={'specimenNo'}
											onChange={handleSampleChange}
										/>
									</div>
								</div>
								<div className="row col-4">
									<div className="col-6 text-right">檢體類別:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.specimenType}
												name={'specimenType'}
												onChange={handleSampleChange}
											>
												{Object.keys(SpecimenType).map((result) => {
													return (
														<MenuItem value={SpecimenType[result]}>
															{SpecimenType[result]}
														</MenuItem>
													);
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
												value={row.specimenStatus}
												name={'specimenStatus'}
												onChange={handleSampleChange}
											>
												{Object.keys(SpecimenStatus).map((result) => {
													return (
														<MenuItem value={SpecimenStatus[result]}>
															{SpecimenStatus[result]}
														</MenuItem>
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
										<Input
											value={row.patientName}
											name={'patientName'}
											onChange={handleSampleChange}
										/>
									</div>
								</div>
								<div className="row col-4">
									<div className="col-6 text-right">性別:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.patientSex}
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
											value={`${new Date(row.patientBirth).getFullYear()}-${new Date(
												row.patientBirth
											).getMonth() >8
												? new Date(row.patientBirth).getMonth() + 1
												: '0' + (new Date(row.patientBirth).getMonth() + 1)}-${new Date(
												row.patientBirth
											).getDate() > 9
												? new Date(row.patientBirth).getDate()
												: '0' + new Date(row.patientBirth).getDate()}`}
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
									<div className="col-6 text-right">品質主管:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.qualityManager}
												name={'qualityManager'}
												onChange={handleSampleChange}
											>
												{memberlist[HealthCareWorkerRole['MT']]!==undefined?
												memberlist[HealthCareWorkerRole['MT']].map((result) => {
													return <MenuItem value={result.workerId}>{result.name}</MenuItem>;
												}):null}
											</Select>
										</FormControl>
									</div>
								</div>
								<div className="row col-6">
									<div className="col-6 text-right">報告醫師:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.reportDoctor}
												name={'reportDoctor'}
												onChange={handleSampleChange}
											>
												{memberlist[HealthCareWorkerRole['VS']]!==undefined?
												memberlist[HealthCareWorkerRole['VS']].map((result) => {
													return <MenuItem value={result.workerId}>{result.name}</MenuItem>;
												}):null}
											</Select>
										</FormControl>
									</div>
								</div>
							</div>
							<div className="row mt-2">
								<div className="row col-6">
									<div className="col-6 text-right">檢查者:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.checker}
												name={'checker'}
												onChange={handleSampleChange}
											>
												{memberlist[HealthCareWorkerRole['MT']]!==undefined?
												memberlist[HealthCareWorkerRole['MT']].map((result) => {
													return <MenuItem value={result.workerId}>{result.name}</MenuItem>;
												}):null}
											</Select>
										</FormControl>
									</div>
								</div>
								<div className="row col-6">
									<div className="col-6 text-right">確認者:</div>
									<div className="col-6">
										<FormControl variant="outlined">
											<Select
												labelId="demo-simple-select-outlined-label2"
												value={row.confirmer}
												name={'confirmer'}
												onChange={handleSampleChange}
											>
												{memberlist[HealthCareWorkerRole['VS']]!==undefined?
												memberlist[HealthCareWorkerRole['VS']].map((result) => {
													return <MenuItem value={result.workerId}>{result.name}</MenuItem>;
												}):null}
											</Select>
										</FormControl>
									</div>
								</div>
							</div>
								
								<Typography
									className={classes.title + ' mt-4'}
									variant="h6"
									id="tableTitle"
									component="div"
								>
									Variant list
								</Typography>
								<Table aria-label="simple table">
									<caption>
										<TextField
											id="outlined-multiline-static"
											label="Note"
											multiline
											rows={4}
											value={row.note1}
											name={"note1"}
											onChange={handleSampleChange}
											variant="outlined"
											style={{ width: '100%' }}
										/>
									</caption>
									<TableHead>
										<TableRow>
											<TableCell>Gene</TableCell>
											<TableCell>Refenence</TableCell>
											<TableCell>Nucleotide Change</TableCell>
											<TableCell>Protein Change</TableCell>
											<TableCell>VAF</TableCell>
											<TableCell>Depth</TableCell>
											<TableCell>Classification</TableCell>
										</TableRow>
									</TableHead>
									{row.list1.map((element) => (
										<TableRow>
											<TableCell>{element.geneName}</TableCell>
											<TableCell>{Reference[element.geneName]}</TableCell>
											<TableCell>{element.HGVSc}</TableCell>
											<TableCell>{element.HGVSp}</TableCell>
											<TableCell>{parseFloat((element.freq / 100.0).toFixed(2))}</TableCell>
											<TableCell>{element.depth}</TableCell>
											<TableCell>{element.clinicalSignificance}</TableCell>
										</TableRow>
									))}
								</Table>
								
								<Typography
									className={classes.title + ' mt-4'}
									variant="h6"
									id="tableTitle"
									component="div"
								>
									Regions with Insufficient Coverage for Evaluation ({'<'}50X)
								</Typography>
								<Table aria-label="simple table">
									<TableHead>
										<TableRow>
											<TableCell>Gene</TableCell>
											<TableCell>Exon</TableCell>
											<TableCell>From (codon)</TableCell>
											<TableCell>To (codon)</TableCell>
										</TableRow>
									</TableHead>
									{row.list4.map((element) => (
										<TableRow>
											<TableCell>{element.gene}</TableCell>
											<TableCell>{element.exon}</TableCell>
											<TableCell>{element.from}</TableCell>
											<TableCell>{element.to}</TableCell>
										</TableRow>
									))}
								</Table>
							
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

type ExportPdfCollapsibleTable = {
	pdfData: Array<PdfData>;
	memberlist;
};

export const ExportPdfCollapsibleTable: FunctionComponent<ExportPdfCollapsibleTable> = (props) => {
	const classes = useStyles();

	
	
	
	return (
		<React.Fragment>
			<TableContainer component={Paper}>
				<Table className={classes.table} aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>SID</TableCell>
							<TableCell>Run Name</TableCell>
							<TableCell>Sample Name</TableCell>
							<TableCell>病歷號</TableCell>
							<TableCell>科分號</TableCell>
							<TableCell>檢查日期</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>{props.pdfData.map((row, index) => <Row key={index} row={row} index={index} memberlist={props.memberlist} />)}</TableBody>
				</Table>
			</TableContainer>
		</React.Fragment>
	);
};
