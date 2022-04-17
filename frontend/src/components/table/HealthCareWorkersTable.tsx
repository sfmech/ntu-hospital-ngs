import React, { FunctionComponent, useState } from 'react';
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
import DeleteIcon from '@material-ui/icons/Delete';
import { Backdrop, CircularProgress } from '@material-ui/core';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import { AddHealthCareWorkersModal } from '../modals/AddHealthCareWorkersModal';

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
	id: keyof HealthCareWorkers;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'workerId', numeric: true, disablePadding: false, label: 'Id' },
	{ id: 'name', numeric: false, disablePadding: false, label: 'Name' },
	{ id: 'number', numeric: false, disablePadding: false, label: 'Number' },
	{ id: 'role', numeric: false, disablePadding: false, label: 'Role' },
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	numSelected: number;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof HealthCareWorkers) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	order: Order;
	orderBy: string;
	rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
	const createSortHandler = (property: keyof HealthCareWorkers) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox">
					<Checkbox
						indeterminate={numSelected > 0 && numSelected < rowCount}
						checked={rowCount > 0 && numSelected === rowCount}
						onChange={onSelectAllClick}
						inputProps={{ 'aria-label': 'select all desserts' }}
					/>
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
    selected: number[];
	handleDelete: (ids: number[]) => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
	const classes = useToolbarStyles();
    const { selected, numSelected, handleDelete } = props;
    const [ showModal, setShowModal ] = useState(false);

	return (
		<Toolbar
			className={clsx(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			<Tooltip title="Add">
					<IconButton aria-label="add" onClick={() => setShowModal(true)}>
						<AddIcon />
					</IconButton>
			</Tooltip>
            <AddHealthCareWorkersModal show={showModal} onClose={() => setShowModal(false)}/>
			{numSelected > 0 ? (
				<Tooltip title="Delete">
					<IconButton aria-label="delete" onClick={() => handleDelete(selected)}>
						<DeleteIcon />
					</IconButton>
				</Tooltip>
			) : null}
			{numSelected > 0 ? (
				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{numSelected} selected
				</Typography>
			) : (
				<Typography className={classes.title} variant="h6" id="tableTitle" component="div">
					{props.title}
				</Typography>
			)}
            
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
type HealthCareWorkersTable = {
	data: HealthCareWorkers[];
};

export const HealthCareWorkersTable: FunctionComponent<HealthCareWorkersTable> = (props) => {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ order, setOrder ] = React.useState<Order>('asc');
	const [ orderBy, setOrderBy ] = React.useState<keyof HealthCareWorkers>('workerId');
	const [ selected, setSelected ] = React.useState<number[]>([]);
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const rows = props.data;
	const deleteUser = async (ids) => {
		try {
			setOpen(true);
			await axios.post(`${ApiUrl}/api/deleteHealthCareWorkers`, {
				data: props.data.filter((data) => selected.includes(data.workerId))
			});
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
            setSelected([]);
            window.location.reload();
		}
    };


	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof HealthCareWorkers) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.checked) {
			const newSelecteds = rows.map((n) => n.workerId);
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

	const handleDelete = (ids) => {
		deleteUser(ids)
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

	return (
		<React.Fragment>
			<Paper className={classes.paper}>
				<EnhancedTableToolbar
					numSelected={selected.length}
                    title="Healthcare Workers"
					handleDelete={handleDelete}
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
						/>
						<TableBody>
							{rows.length > 0 ? (
								stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const isItemSelected = isSelected(row.workerId);
										const labelId = `enhanced-table-checkbox-${index}`;

										return (
											<TableRow
												hover
												onClick={(event) => handleClick(event, row.workerId)}
												role="checkbox"
												aria-checked={isItemSelected}
												tabIndex={-1}
												key={row.workerId}
												selected={isItemSelected}
											>
												<TableCell padding="checkbox">
													<Checkbox
														checked={isItemSelected}
														inputProps={{ 'aria-labelledby': labelId }}
													/>
												</TableCell>
												<TableCell component="th" scope="row" align="right">{row.workerId}</TableCell>
												<TableCell align="right">{row.name}</TableCell>
												<TableCell align="right">{row.number}</TableCell>
												<TableCell align="right">{row.role}</TableCell>
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
					onPageChange={handleChangePage}
					onChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			</Paper>
			<Backdrop className={classes.backdrop} open={open} onClick={handleClose}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
