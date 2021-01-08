import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddIcon from '@material-ui/icons/Add';
import { Segment } from '../../models/segment.model';
import { Backdrop, CircularProgress, FormControl, MenuItem, Select } from '@material-ui/core';
import { ResultContext } from '../../contexts/result.context';
import { ClinicalSignificance } from '../../models/clinicalSignificance.enum';
import { AddSegmentTagModal } from '../modals/AddSegmentTagModal';

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
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
	disablePadding: boolean;
	id: keyof Segment;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'chr', numeric: false, disablePadding: true, label: 'Chr' },
	{ id: 'position', numeric: false, disablePadding: false, label: 'Position' },
	{ id: 'dbSNP', numeric: false, disablePadding: false, label: 'dbSNP' },
	{ id: 'freq', numeric: true, disablePadding: false, label: 'Freq' },
	{ id: 'depth', numeric: true, disablePadding: false, label: 'Depth' },
	{ id: 'annotation', numeric: false, disablePadding: false, label: 'Annotation' },
	{ id: 'geneName', numeric: false, disablePadding: false, label: 'Gene_Name' },
	{ id: 'HGVSc', numeric: false, disablePadding: false, label: 'HGVS.c' },
	{ id: 'HGVSp', numeric: false, disablePadding: false, label: 'HGVS.p' },
	{ id: 'clinicalSignificance', numeric: false, disablePadding: false, label: 'Clinical significance' },
	{ id: 'remark', numeric: false, disablePadding: false, label: 'remark' },
	{ id: 'editor', numeric: false, disablePadding: false, label: 'editor' },
	{ id: 'globalAF', numeric: true, disablePadding: false, label: 'Global_AF' },
	{ id: 'AFRAF', numeric: true, disablePadding: false, label: 'AFR_AF' },
	{ id: 'AMRAF', numeric: true, disablePadding: false, label: 'AMR_AF' },
	{ id: 'EURAF', numeric: true, disablePadding: false, label: 'EUR_AF' },
	{ id: 'ASNAF', numeric: true, disablePadding: false, label: 'ASN_AF' }
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Segment) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
	isEditable: boolean;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, isEditable } = props;
	const createSortHandler = (property: keyof Segment) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					{!isEditable?
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={rowCount > 0 && numSelected === rowCount}
							onChange={onSelectAllClick}
							inputProps={{ 'aria-label': 'select all desserts' }}
						/>:null
					}
				</TableCell>
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

const useToolbarStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(1)
		},
		highlight:
			theme.palette.type === 'light'
				? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
				}
				: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
		title: {
			flex: '1 1 100%'
		}
	})
);

interface EnhancedTableToolbarProps {
	numSelected: number;
	title: string;
	rows: Segment[];
	selected: number[];
	handleAdd: (segments: Segment[]) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
	const { selected, numSelected, handleAdd, rows } = props;
    const [ showModal, setShowModal ] = useState(false);

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
					<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
						{props.title}
					</Typography>
				)}
			<AddSegmentTagModal show={showModal} title={props.title} onSave={(segments: Segment[]) => handleAdd(segments)} onClose={() => setShowModal(false)} segments={rows.filter((data) => selected.includes(data.segmentId))}></AddSegmentTagModal>
			{numSelected > 0 ? (
				<Tooltip title="add">
					<IconButton aria-label="add"  onClick={() => setShowModal(true)}>
						<AddIcon />
					</IconButton>
				</Tooltip>
			) : null}
		</Toolbar>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			width: '100%',
			marginBottom: theme.spacing(2)
		},
		table: {
			minWidth: 900
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
type SegmentTable = {
	data: Segment[];
	setSelectSegments: (segments: Segment[]) => void
	title: string;
	isEditMode: boolean;
	handleAdd: (segments: Segment[]) => void;
};

export const SegmentTable: FunctionComponent<SegmentTable> = (props) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [order, setOrder] = React.useState<Order>('asc');
	const { updateSegment } = useContext(ResultContext);
	const [orderBy, setOrderBy] = React.useState<keyof Segment>('chr');
	const [selected, setSelected] = React.useState<number[]>([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [rows, setRows] = useState(new Array<Segment>());
	useEffect(() => {
		setSelected([]);
		setOrder('asc');
		setOrderBy('chr');
		setPage(0)
		setRows(props.data.map((d) => {
			d.freq = parseFloat(d.freq as unknown as string);
			d.depth = parseInt(d.depth as unknown as string);

			return d;
		}));
	}, [props.data])
	const handleAdd = async (segments: Segment[]) => {
		try {
			setOpen(true);
			props.handleAdd(segments)
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
			setSelected([]);
		}
	};

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Segment) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.segmentId);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const isSelected = (id: number) => selected.indexOf(id) !== -1;

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	
	const onChange = async (e, row) => {
		const value = e.target.value;
		const name = e.target.name;
		const { segmentId } = row;
		const newRows = rows.map(row => {
			if (row.segmentId === segmentId) {
				updateSegment({ ...row, [name]: value })
				return { ...row, [name]: value };
			}
			return row;
		});
		
		setRows(newRows);
	};
	return (
		<React.Fragment>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					title={props.title}
					handleAdd={handleAdd}
					rows={rows}
					selected={selected}
				/>
				<TableContainer>
					<Table
						className={classes.table}
						aria-labelledby="tableTitle"
						size={'medium'}
						aria-label="enhanced table"
					>
						<EnhancedTableHead
							classes={classes}
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
							isEditable={props.isEditMode}
						/>
						<TableBody>
							{rows.length > 0 ? (
								stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const isItemSelected = isSelected(row.segmentId);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												role={!props.isEditMode?"checkbox":""}
												aria-checked={isItemSelected}
												onClick={!props.isEditMode?(event) => handleClick(event, row.segmentId):()=>{}}
												tabIndex={-1}
												key={row.segmentId}
												selected={isItemSelected}
											>
												<TableCell padding="checkbox">
													{!props.isEditMode?
														<Checkbox
															checked={isItemSelected}
															inputProps={{ 'aria-labelledby': labelId }}
														/>:null
													}
												</TableCell>
												<TableCell component="th" scope="row">
													{row.chr}
												</TableCell>
												<TableCell align="right">{row.position}</TableCell>
												<TableCell align="right">{row.dbSNP}</TableCell>
												<TableCell align="right">{row.freq}%</TableCell>
												<TableCell align="right">{row.depth}</TableCell>
												<TableCell align="right">{row.annotation}</TableCell>
												<TableCell align="right">{row.geneName}</TableCell>
												<TableCell align="right">{row.HGVSc}</TableCell>
												<TableCell align="right">{row.HGVSp}</TableCell>
												<TableCell align="right">
													{props.isEditMode ? (
														<FormControl variant="outlined">
														<Select
															labelId="demo-simple-select-outlined-label"
															value={row.clinicalSignificance}
															name={"clinicalSignificance"}
															onChange={e => onChange(e, row)}
														>
															{Object.keys(ClinicalSignificance).map((result) => {
																return <MenuItem value={ClinicalSignificance[result]}>{ClinicalSignificance[result]}</MenuItem>;
															})}
														</Select>
													</FormControl>
													) : (
															row.clinicalSignificance
														)
													}
												</TableCell>
												<TableCell align="right">{row.remark}</TableCell>
												<TableCell align="right">{row.editor}</TableCell>
												<TableCell align="right">{row.globalAF}</TableCell>
												<TableCell align="right">{row.AFRAF}</TableCell>
												<TableCell align="right">{row.AMRAF}</TableCell>
												<TableCell align="right">{row.EURAF}</TableCell>
												<TableCell align="right">{row.ASNAF}</TableCell>
											</TableRow>
										);
									})
							) : null}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[5, 10, 25]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
