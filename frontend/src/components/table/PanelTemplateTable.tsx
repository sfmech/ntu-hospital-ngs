import React, { FunctionComponent, useEffect, useState } from 'react';
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
import AddIcon from '@material-ui/icons/Add';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Backdrop, Button, CircularProgress } from '@material-ui/core';
import { ClinicalSignificance } from '../../models/clinicalSignificance.enum';
import useCookies from 'react-cookie/cjs/useCookies';
import { HotspotModal } from '../modals/AddHotspotModal';
import { Panel } from '../../models/panel.model';
import { ApiUrl } from '../../constants/constants';
import axios from 'axios';
import { AddPanelModal } from '../modals/AddPanelModal';
import { ExportManualPdfModal } from '../modals/ExportManualPdfModal';
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

interface HeadCell {
	disablePadding: boolean;
	id: keyof Panel;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'panelId', numeric: false, disablePadding: true, label: 'Panel Id' },
	{ id: 'panelName', numeric: false, disablePadding: true, label: 'Panel Name' },
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Panel) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { classes, order, orderBy, rowCount, onRequestSort } = props;
	const createSortHandler = (property: keyof Panel) => (event: React.MouseEvent<unknown>) => {
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
				<TableCell>
					Operate
				</TableCell>
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
	title: string;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
    const [ showModal, setShowModal ] = useState(false);

	return (
		<Toolbar
			className={clsx(classes.root)}
		>
			<Tooltip title="Add">
					<IconButton aria-label="add" onClick={() => setShowModal(true)}>
						<AddIcon />
					</IconButton>
			</Tooltip>
			<AddPanelModal show={showModal} onClose={() => setShowModal(false)}/>

			<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
				{props.title}
			</Typography>
			
			
		</Toolbar>
	);
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		paper: {
			width: '100%',
			marginBottom: theme.spacing(2),
			paddingLeft: theme.spacing(2),
			paddingRight: theme.spacing(1)
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
type PanelTemplateTable = {
	data: Panel[];

};

export const PanelTemplateTable: FunctionComponent<PanelTemplateTable> = (props) => {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ show, setShow ] = React.useState(false);
	const [ order, setOrder ] = React.useState<Order>('asc');
	const [ orderBy, setOrderBy ] = React.useState<keyof Panel>('panelId');
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const [ panelId, setPanelId ] = React.useState(0);
	const [ rows, setRows ] = useState(new Array<Panel>());
	const [ cookies ] = useCookies();
	const deletePanel = async (id) => {
		try {
			setOpen(true);
			await axios.post(`${ApiUrl}/api/deletePanels`, {
				data: props.data.filter((data) => data.panelId===id)
			});
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
            window.location.reload();
		}
    };
	useEffect(
		() => {
			//console.log(props.data);
			setOrder('asc');
			setOrderBy('panelId');
			setPage(0);
			setRows(props.data);
			setPanelId(0);
		},
		[ props.data ]
	);


	const handleExportClick = (id: number) => {
		setShow(true);
		setPanelId(id);

	};

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Panel) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};





	const handleDelete = (ids) => {
		deletePanel(ids);
	};

	const handleChangePage = (event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};


	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


	return (
		<React.Fragment>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					title={"Panel Template"}
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
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={rows.length}
						/>
						<TableBody>
							{rows.length > 0 ? (
								stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										return (
											<TableRow
												key={row.panelId}
											>
												<TableCell component="th" scope="row"  align="right">{row.panelId}</TableCell>
												<TableCell align="right">{row.panelName}</TableCell>
												<TableCell>
													<Button className='mx-2' variant="contained" onClick={()=>handleExportClick(row.panelId)}>Export</Button>
													<Button variant='contained' color="secondary" onClick={()=>handleDelete(row.panelId)}>Delete</Button>
												</TableCell>
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
					rowsPerPageOptions={[ 5, 10, 25 ]}
					component="div"
					count={rows.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onChangePage={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<ExportManualPdfModal show={show} data={props.data} panelId={panelId}  onClose={() => setShow(false)}></ExportManualPdfModal>
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
