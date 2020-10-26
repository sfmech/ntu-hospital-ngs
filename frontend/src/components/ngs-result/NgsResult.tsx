import { createStyles, FormControl, IconButton, InputBase, makeStyles, Paper, Select, Theme } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { CollapsibleTable } from '../table/CollapsibleTable';
import SearchIcon from '@material-ui/icons/Search';
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
			minWidth: 120
		}
	})
);
export const NgsResult: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ condition, setCondition ] = useState('runName');
	const [ samples, setSamples ] = useState(Array<Sample>());
	const [ segments, setSegments ] = useState(Array<Segment>());
	const [ input, setInput ] = useState('');

	useEffect(() => {
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
	}, []);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCondition(event.target.value as string);
		setInput('');
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	const handleSearchClick = () => {};

	/**
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

			<div className="row justify-content-center mt-3 px-4">
				<CollapsibleTable
					samples={samples.reduce((groups, item) => {
						const val = `${item.run.runId}_${item.run.runName}`;
						groups[val] = groups[val] || [];
						groups[val].push(item);
						return groups;
					}, {})}
					segments={segments}
				/>
			</div>
		</React.Fragment>
	);
};
