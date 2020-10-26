import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import SearchIcon from '@material-ui/icons/Search';
import './Setting.css';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SegmentTagTable } from '../table/SegmentTagTable';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { SegmentTag } from '../../models/segmentTag.model';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { Backdrop, CircularProgress } from '@material-ui/core';
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
		},

	})
);

export const Setting: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ condition, setCondition ] = useState('chr');
	const [ input, setInput ] = useState('');

	const { blacklist, whitelist, deleteBlacklist, deleteWhitelist } = useContext(SegmentTagContext);
	const [ showBlacklist, setShowBlacklist ] = useState<SegmentTag[]>(blacklist);
	const [ showWhitelist, setShowWhitelist ] = useState<SegmentTag[]>(whitelist);

	useEffect(
		() => {
			setShowBlacklist(blacklist);
			setShowWhitelist(whitelist);
		},
		[ blacklist, whitelist ]
	);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCondition(event.target.value as string);
		setInput('');
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	const handleSearchClick = () => {
		if(blacklist.length>0)
			setShowBlacklist(blacklist.filter((data) => data[condition].indexOf(input) !== -1));
		if(whitelist.length>0)
			setShowWhitelist(whitelist.filter((data) => data[condition].indexOf(input) !== -1));
	};

	const handleBlacklistDelete = (ids: string[]) => {
		setShowBlacklist(showBlacklist.filter((data) => !ids.includes(data.id)));
		deleteBlacklist(ids);
	};

	const handleWhitelistDelete = (ids: string[]) => {
		setShowWhitelist(showWhitelist.filter((data) => !ids.includes(data.id)));
		deleteWhitelist(ids);
	};


	return (
		<React.Fragment>
			<Title>Setting</Title>
			<div className="row ml-3 mt-3">
				<FormControl variant="outlined" className={classes.formControl}>
					<Select native value={condition} onChange={handleChange}>
						<option value="chr">Chr</option>
						<option value="position">Position</option>
						<option value="HGVSc">HGVSc</option>
						<option value="HGVSp">HGVSp</option>
					</Select>
				</FormControl>
				<Paper className={classes.root}>
					<InputBase
						value={input}
						onChange={handleInputChange}
						className={classes.input}
						placeholder="Search Blacklist and Whitelist"
					/>
					<IconButton type="submit" aria-label="search" onClick={handleSearchClick}>
						<SearchIcon />
					</IconButton>
				</Paper>
			</div>
			<div className="row justify-content-center mt-3 px-4">
				<SegmentTagTable data={showBlacklist} title="Blacklist" handleDelete={handleBlacklistDelete} deleteUrl={`${ApiUrl}/api/deleteBlacklist`}/>
			</div>
			<div className="row justify-content-center mt-3 px-4">
				<SegmentTagTable data={showWhitelist} title="Whitelist" handleDelete={handleWhitelistDelete} deleteUrl={`${ApiUrl}/api/deleteWhitelist`}/>
			</div>

		</React.Fragment>
	);
};
