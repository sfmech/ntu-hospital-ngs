import React, { FunctionComponent, useState } from 'react';
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
import { Sample } from '../../models/sample.model';
import { useHistory } from 'react-router-dom';
import { SampleModal } from '../modals/SampleModal';
import { Segment } from '../../models/segment.model';
import { MutationQC } from '../../models/mutationQC.model';
import { createStyles, TableSortLabel, Theme } from '@material-ui/core';

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
			minWidth: 800
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

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset'
		}
	}
});
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
	{ id: 'QC', numeric: true, disablePadding: false, label: 'QC' },
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

function Row(props: { row: MutationQC[], index: string}) {
	const { row, index } = props;
	const [ open, setOpen ] = React.useState(false);
	const [ order, setOrder ] = React.useState<Order>('asc');
	const [ orderBy, setOrderBy ] = React.useState<keyof MutationQC>('position');
	const classes = useRowStyles();
	const headClasses = useStyles();
	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof MutationQC) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};



	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell>
					{index}
				</TableCell>
				<TableCell>
					{row.filter((r)=>r.QC>49).length+" ("+(row.filter((r)=>r.QC>49).length/row.length*100).toFixed(2) +"%)"}
				</TableCell>
				<TableCell>
					{row.filter((r)=>r.QC>249).length+" ("+(row.filter((r)=>r.QC>249).length/row.length*100).toFixed(2) +"%)"}
				</TableCell>
				<TableCell>
					{row.filter((r)=>r.QC<50).length}
				</TableCell>
				<TableCell>
					{row.length}
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Mutation QC
							</Typography>
							<Table size="small" aria-label="purchases">
							<EnhancedTableHead
							classes={headClasses}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
						/>
								<TableBody>
									{stableSort(row, getComparator(order, orderBy)).map((mutationQCRow) => (
										<TableRow
											key={mutationQCRow.mutationId}
											style={{backgroundColor: mutationQCRow.QC<50?"#DF686A":(mutationQCRow.QC<250?"orange":"#28a745")}}
										>
											<TableCell component="th" scope="row">
												{mutationQCRow.chr}
											</TableCell>
											<TableCell align="right">
												{mutationQCRow.position}
											</TableCell>
											<TableCell align="right">
												{mutationQCRow.cosmic}
											</TableCell>
											<TableCell style={{maxWidth: '80px', whiteSpace:'normal', wordWrap: 'break-word'}}>
												{mutationQCRow.HGVSc}
											</TableCell>
											<TableCell style={{maxWidth: '80px', whiteSpace:'normal', wordWrap: 'break-word'}}>
												{mutationQCRow.HGVSp}
											</TableCell>
											<TableCell align="right">
												{mutationQCRow.QC}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</React.Fragment>
	);
}

type MutationQCCollapsibleTable = {
	mutationQCs: MutationQC[];
};

export const MutationQCCollapsibleTable: FunctionComponent<MutationQCCollapsibleTable> = (props) => {
	const rows = props.mutationQCs.map((d)=>{
		d.QC = parseInt(d.QC as unknown as string)
		return d
	});
	const testmutationqcs=rows.reduce((groups, item) => {
		const val = item.geneName;
		groups[val] = groups[val] || [];
		groups[val].push(item);
		return groups;
	}, {})
	return (
		<React.Fragment>
			<TableContainer component={Paper}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Gene Name</TableCell>
							<TableCell>(optimum) Pass Percentage</TableCell>
							<TableCell>Pass Percentage</TableCell>
							<TableCell>Failed</TableCell>
							<TableCell>Total</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(testmutationqcs).map((key) => (
							<Row key={key} row={testmutationqcs[key]} index={key} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</React.Fragment>
	);
};
