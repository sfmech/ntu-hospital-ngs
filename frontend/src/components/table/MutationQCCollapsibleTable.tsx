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

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset'
		}
	}
});

function Row(props: { row: MutationQC[], index: string}) {
	const { row, index } = props;
	const [ open, setOpen ] = React.useState(false);
	const classes = useRowStyles();
	row.sort(function (a, b) {
		return a.QC-b.QC;
	  });



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
					{row.filter((r)=>r.QC>99).length+" ("+(row.filter((r)=>r.QC>99).length/row.length*100).toFixed(2) +"%)"}
				</TableCell>
				<TableCell>
					{row.filter((r)=>r.QC>499).length+" ("+(row.filter((r)=>r.QC>99).length/row.length*100).toFixed(2) +"%)"}
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
								<TableHead>
									<TableRow>
										<TableCell>Chr</TableCell>
										<TableCell>Position</TableCell>
										<TableCell>Cosmic</TableCell>
										<TableCell>HGVS.c</TableCell>
										<TableCell>HGVS.p</TableCell>
										<TableCell>QC</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.map((mutationQCRow) => (
										<TableRow
											key={mutationQCRow.mutationId}
											style={{backgroundColor: mutationQCRow.QC<100?"#DF686A":(mutationQCRow.QC<500?"orange":"#28a745")}}
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
							<TableCell>(optimal) Pass Percentage</TableCell>
							<TableCell>Pass Percentage</TableCell>
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
