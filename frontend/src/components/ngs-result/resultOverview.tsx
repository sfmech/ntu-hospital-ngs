import {
	Button,
	createStyles,
	FormControl,
	IconButton,
	InputBase,
	InputLabel,
	makeStyles,
	MenuItem,
	Paper,
	Select,
	Theme,
	Typography
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CollapsibleTable } from '../table/CollapsibleTable';
import SearchIcon from '@material-ui/icons/Search';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Title } from '../title/Title';
import { Segment } from '../../models/segment.model';
import { Sample } from '../../models/sample.model';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: '2px 4px',
			display: 'flex',
			alignItems: 'center',
			width: 400,
			'& .Mui-focused': {
				color: 'green'
			}
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 200
		}
	})
);
export const ResultOverview: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ condition, setCondition ] = useState('runName');
	const [ open, setOpen ] = React.useState(false);
	const [ samples, setSamples ] = useState(Array<Sample>());
	const [ segments, setSegments ] = useState(Array<Segment>());
	const [ resultlist, setResultlist ] = useState(Array<string>());
	const [ selectResult, setSelectResult ] = useState<string>('');
	const [ input, setInput ] = useState('');

	useEffect(() => {
		const getResultlist = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/resultlist`);
				console.log(response.data)
				setResultlist(response.data)
			} catch (error) {
				console.log(error);
			}
		};
		const getAllSamples = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/samples`);
				setSamples(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllSegments = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/segments`);
				setSegments(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllSamples();
		getAllSegments();
		getResultlist();
	}, []);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectResult(event.target.value as string);
	};

	const handleUploadResult = () => {
		const uploadResult = async () => {
			try {
				setOpen(true);
				const response = await axios.post(`${ApiUrl}/api/uploadresult`, {
					data: selectResult
				});
			} catch (error) {
				console.log(error);
			} finally {
				window.location.reload(false);
				setOpen(false);
			}
		};
		uploadResult();
	};
	/**
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCondition(event.target.value as string);
		setInput('');
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	const handleSearchClick = () => {};

	
	 			<div className="row ml-3 mt-3">
				<FormControl variant="outlined" className={classes.formControl}>
					<Select native value={condition} onChange={handleChange}>
						<option value="runName">Run Name</option>
						<option value="startTime">Start Time</option>
						<option value="endTime">End Time</option>
					</Select>
				</FormControl>
				<Paper className={classes.root}>
					<InputBase
						value={input}
						onChange={handleInputChange}
						className={classes.input}
						placeholder="Search Run"
					/>
					<IconButton type="submit" aria-label="search" onClick={handleSearchClick}>
						<SearchIcon />
					</IconButton>
				</Paper>
			</div>
	 */
	return (
		<React.Fragment>
			<Title>Results Overview</Title>
			<Paper className="mt-3 px-5 py-2">
				<div className="row">
					<Typography variant="h5" className="file-list-title ml-2">
						Upload folder
					</Typography>
				</div>
				<div className="row justify-content-center">
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="demo-simple-select-outlined-label">Result Folder</InputLabel>
						<Select
							labelId="demo-simple-select-outlined-label"
							id="demo-simple-select-outlined"
							value={selectResult}
							onChange={handleChange}
							label="Result Folder"
						>
							{resultlist.map((result) => {
								return <MenuItem value={result}>{result}</MenuItem>;
							})}
						</Select>
					</FormControl>
					<Button
						className="ml-2"
						variant="contained"
						color="default"
						startIcon={<FolderOpenIcon />}
						onClick={handleUploadResult}
						disabled={resultlist.length <= 0 || selectResult === ''}
					>
						Upload
					</Button>
				</div>
			</Paper>
			<div className="row justify-content-center mt-3 px-4">
				<CollapsibleTable
					samples={samples.reduce((groups, item) => {
						const val = `${item.run.runId}_${item.run.runName}`;
						groups[val] = groups[val] || [];
						groups[val].push(item);
						return groups;
					}, {})}
					segments={segments.reduce((groups, item) => {
						const val = item.sample.sampleId;
						groups[val] = groups[val] || [];
						groups[val].push(item);
						return groups;
					}, {})}
				/>
			</div>
		</React.Fragment>
	);
};
