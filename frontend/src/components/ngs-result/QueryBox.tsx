import { createStyles, InputBase, makeStyles, MenuItem, Paper, Select, TextField, Theme, Typography, withStyles } from '@material-ui/core';
import React, { FunctionComponent, useContext, useState } from 'react';
import { ResultOptionContext } from '../../contexts/result-option.context';
import { QueryCondition } from '../../models/query.condition.enum';

const BootstrapInput = withStyles((theme: Theme) =>
	createStyles({
		root: {
			'label + &': {
				marginTop: theme.spacing(3)
			}
		},
		input: {
			borderRadius: 4,
			position: 'relative',
			backgroundColor: theme.palette.background.paper,
			border: '1px solid #ced4da',
			fontSize: 16,
			padding: '10px 26px 10px 12px',
			transition: theme.transitions.create([ 'border-color', 'box-shadow' ]),
			// Use the system font instead of the default Roboto font.
			fontFamily: [
				'-apple-system',
				'BlinkMacSystemFont',
				'"Segoe UI"',
				'Roboto',
				'"Helvetica Neue"',
				'Arial',
				'sans-serif',
				'"Apple Color Emoji"',
				'"Segoe UI Emoji"',
				'"Segoe UI Symbol"'
			].join(','),
			'&:focus': {
				borderRadius: 4,
				borderColor: '#80bdff',
				boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
			}
		}
	})
)(InputBase);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		searchBar: {
			padding: '2px 4px',
			display: 'flex',
			alignItems: 'center',
			'& .Mui-focused': {
				color: 'green'
			}
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		}
	})
);

export const QueryBox: FunctionComponent = (prop) => {
    const { input, condition, setInput, setCondition } = useContext(ResultOptionContext);
	const now = new Date(Date.now());
	const [selectedStartDate, setSelectedStartDate] = React.useState(`${now.getFullYear()}-${(now.getMonth()-3 > 8) ? (now.getMonth()-3 + 1) : ('0' + (now.getMonth()-3 + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);
	const [selectedEndDate, setSelectedEndDate] = React.useState(`${now.getFullYear()}-${(now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);
	const classes = useStyles();
    //sampleResults[key].filter((sampleRow)=>sampleRow.disease.enName.indexOf(input)!==-1 || sampleRow.sampleName.split('_')[0].indexOf(input)!==-1)
    const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCondition(event.target.value as string);
		if(event.target.value===QueryCondition.StartDate)
			setInput(selectedStartDate+"~"+selectedEndDate);
		else
			setInput('');
	};
	const handleDateStartChange = (event: React.ChangeEvent<{ value: unknown }>) => {	
		setSelectedStartDate(event.target.value as string);
		setInput(event.target.value as string+"~"+selectedEndDate);
  };
  	const handleEndDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {	
		setSelectedEndDate(event.target.value as string);
		setInput(selectedStartDate+"~"+event.target.value as string);
	};

	return (
		<React.Fragment>
			<Paper className={classes.searchBar}>
                <Select
					labelId="demo-customized-select-label"
					id="demo-customized-select"
					value={condition}
					onChange={handleChange}
					input={<BootstrapInput />}
				>
					<MenuItem value={QueryCondition.DiseaseEnName}>Disease Name</MenuItem>
					<MenuItem value={QueryCondition.SampleName}>Sample Name</MenuItem>
                    <MenuItem value={QueryCondition.StartDate}>Date</MenuItem>
				</Select>
				{
					condition===QueryCondition.StartDate?
					<><TextField
							id="startdate"
							label="start date"
							type="date"
							defaultValue={selectedStartDate}
							onChange={handleDateStartChange}
							className={classes.textField + " my-3 ml-3"}
							InputLabelProps={{
								shrink: true,
							}} /><Typography variant="h5" display="inline" style={{ lineHeight: "80px" }}>~</Typography>
							<TextField
								id="enddate"
								label="end date"
								type="date"
								defaultValue={selectedEndDate}
								onChange={handleEndDateChange}
								className={classes.textField + " my-3"}
								InputLabelProps={{
									shrink: true,
								}} /></>:
						<InputBase
							value={input}
							onChange={handleInputChange}
							className={classes.input}
						/>

				}
				
				
			</Paper>
		</React.Fragment>
	);
};
