import {
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	TextField,
	Theme,
} from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Run } from '../../models/run.model';

type EditRunDateModalProps = {
	show: boolean;
	run: Run;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400,
			
		},
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		  },
		  textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		  },
    })
);

export const EditRunDateModal: FunctionComponent<EditRunDateModalProps> = (props) => {
    const classes = useStyles();
	const [selectedDate, setSelectedDate] = React.useState("2021-01-01");
	useEffect(()=>{
		let date = new Date(props.run.startTime)
		setSelectedDate(`${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(
			-2
		)}`);
	},[props.run])
	const handleDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {	
	  	setSelectedDate(event.target.value as string);
	};
	const handleSaveClick = async () =>{
		try {
			props.run.startTime = new Date(selectedDate);
			console.log(selectedDate);
			await axios.post(`${ApiUrl}/api/updateRun`, {
				data: props.run
			});
		} catch (error) {
			console.log(error);
		} finally {
			props.onClose();
		}
	}
	
	
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>{props.run.runName}</DialogTitle>
			<DialogContent className={classes.root} dividers>
				<form className={classes.container} noValidate>
					<TextField
						id="date"
						label="start date"
						type="date"
						defaultValue={selectedDate}
						onChange={handleDateChange}
						className={classes.textField}
						InputLabelProps={{
						shrink: true,
						}}
					/>
				</form>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleSaveClick} color="primary">
					儲存
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
