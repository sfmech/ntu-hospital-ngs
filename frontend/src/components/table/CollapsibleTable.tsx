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

const useRowStyles = makeStyles({
	root: {
		'& > *': {
			borderBottom: 'unset'
		}
	}
});

function Row(props: { row: Sample[] , handleShowModal}) {
	const { row, handleShowModal } = props;
	const [ open, setOpen ] = React.useState(false);
	const classes = useRowStyles();
	const history = useHistory();

	const handleClick = (sampleId: number, sampleName: string) => {
        handleShowModal(sampleId, sampleName);
	};

	return (
		<React.Fragment>
			<TableRow className={classes.root}>
				<TableCell>
					<IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell component="th" scope="row">
					{row[0].run.runName}
				</TableCell>
				<TableCell align="right">{new Date(row[0].run.startTime).toLocaleString()}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
					<Collapse in={open} timeout="auto" unmountOnExit>
						<Box margin={1}>
							<Typography variant="h6" gutterBottom component="div">
								Samples ({row.length})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableHead>
									<TableRow>
										<TableCell>Sample Name</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{row.map((sampleRow) => (
										<TableRow
											key={sampleRow.sampleId}
											onClick={() => handleClick(sampleRow.sampleId, sampleRow.sampleName)}
											hover
										>
											<TableCell component="th" scope="row">
												{sampleRow.sampleName}
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

type CollapsibleTable = {
	samples: {};
	segments: {};
};

export const CollapsibleTable: FunctionComponent<CollapsibleTable> = (props) => {
	const [ showModal, setShowModal ] = useState(false);
	const [ selectedSegments, setSelectedSegments] = useState<Array<Segment>>(new Array<Segment>());
	const [ selectedSample, setSelectedSample] = useState<string>("");
	const handleShowModal = (selectedSampleId, selectedSampleName) => {
		setSelectedSegments(props.segments[selectedSampleId]);
		setSelectedSample(selectedSampleName);

		setShowModal(true);
	};
	return (
		<React.Fragment>
			<TableContainer component={Paper}>
				<Table aria-label="collapsible table">
					<TableHead>
						<TableRow>
							<TableCell />
							<TableCell>Run Name</TableCell>
							<TableCell align="right">Start Time</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Object.keys(props.samples).map((key) => (
							<Row key={key} row={props.samples[key]} handleShowModal={handleShowModal} />
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<SampleModal show={showModal} onClose={() => setShowModal(false)} segments={selectedSegments} title={selectedSample}/>
		</React.Fragment>
	);
};
