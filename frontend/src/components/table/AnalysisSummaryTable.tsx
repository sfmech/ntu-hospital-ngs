import React, { FunctionComponent } from 'react';
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
import { Aligned } from '../../models/aligned.model';

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
	id: keyof Aligned;
	label: string;
	numeric: boolean;
}

const headCells: HeadCell[] = [
	{ id: 'alignmentRate', numeric: false, disablePadding: false, label: 'Alignment Rate' },
	{ id: 'meanCoverage', numeric: false, disablePadding: false, label: 'Mean Coverage' },
	{ id: 'coverRegionPercentage', numeric: false, disablePadding: false, label: 'Cover Region Percentage' },
	{ id: 'control1', numeric: false, disablePadding: false, label: 'Control 1' },
    { id: 'control2', numeric: true, disablePadding: false, label: 'Control 2' },
    { id: 'control3', numeric: true, disablePadding: false, label: 'Control 3' },
];

interface EnhancedTableProps {
	classes: ReturnType<typeof useStyles>;
	onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Aligned) => void;
	order: Order;
	orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
	const { classes, order, orderBy, onRequestSort } = props;
	const createSortHandler = (property: keyof Aligned) => (event: React.MouseEvent<unknown>) => {
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

	return (
		<Toolbar
			className={clsx(classes.root)}
		>
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
type AnalysisSummaryTable = {
	data: Aligned[];
	title: string;
};

export const AnalysisSummaryTable: FunctionComponent<AnalysisSummaryTable> = (props) => {
	const classes = useStyles();
	const [ order, setOrder ] = React.useState<Order>('asc');
	const [ orderBy, setOrderBy ] = React.useState<keyof Aligned>('alignmentRate');
	const [ page, setPage ] = React.useState(0);
	const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
	const rows = props.data.map((d)=>{
        d.alignmentRate = parseFloat(d.alignmentRate as unknown as string);
        d.meanCoverage = parseFloat(d.meanCoverage as unknown as string);
        d.coverRegionPercentage = parseFloat(d.coverRegionPercentage as unknown as string);
        d.control1 = parseFloat(d.control1 as unknown as string);
        d.control2 = parseFloat(d.control2 as unknown as string);
        d.control3 = parseFloat(d.control3 as unknown as string);
		return d
	});
	
	

	const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Aligned) => {
		const isAsc = orderBy === property && order === 'asc';
		setOrder(isAsc ? 'desc' : 'asc');
		setOrderBy(property);
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
					title={props.title}
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
						/>
						<TableBody>
							{rows.length > 0 ? (
								stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										return (
											<TableRow
												tabIndex={-1}
												key={row.alignedId}
											>
												<TableCell align="right" style={{backgroundColor: row.alignmentRate<80?"#ffbdc4":(row.alignmentRate<95?"#ffd68c":"#66f988")}}>{row.alignmentRate}</TableCell>
												<TableCell align="right" style={{backgroundColor: row.meanCoverage<500?"#ffbdc4":(row.meanCoverage<1000?"#ffd68c":"#66f988")}}>{row.meanCoverage}</TableCell>
												<TableCell align="right" style={{backgroundColor: row.coverRegionPercentage<80?"#ffbdc4":(row.coverRegionPercentage<95?"#ffd68c":"#66f988")}}>{row.coverRegionPercentage}</TableCell>
												<TableCell align="right" style={{backgroundColor: row.control1<50?"#ffbdc4":(row.control1<200?"#ffd68c":"#66f988")}}>{row.control1}</TableCell>
                                                <TableCell align="right" style={{backgroundColor: row.control2<50?"#ffbdc4":(row.control2<200?"#ffd68c":"#66f988")}}>{row.control2}</TableCell>
                                                <TableCell align="right" style={{backgroundColor: row.control3<50?"#ffbdc4":(row.control3<200?"#ffd68c":"#66f988")}}>{row.control3}</TableCell>
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
		</React.Fragment>
	);
};
