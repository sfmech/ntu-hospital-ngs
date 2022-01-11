import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import { Button, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme, Typography } from '@material-ui/core';
import './NgsAnalysis.css';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { FileList } from './fileList';
import { Disease } from '../../models/disease.model';
import { FileContext } from '../../contexts/files.context';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 200
		}
	})
);



export const NgsAnalysis: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ diseases, setDiseases ] = useState<Array<Disease>>([]);
	const { analysis, files, beds, setFiles, setAnalysis } = useContext(FileContext);
	const [ bed, setBed ] = React.useState("");

	useEffect(() => {
		const getDiseases = () => {
			try {
				axios(`${ApiUrl}/api/getDiseases`).then((res) => {
					setDiseases(res.data);
				});
			} catch (error){
				console.log(error);
			}
		}
		getDiseases();
		
	}, []);


	const handleClick = () => {
		const runScripts = async () => {
			try {
				setOpen(true);
				await axios.post(`${ApiUrl}/api/runscript`, {data: files, bed: bed});
			} catch (error) {
				console.log(error);
			} finally {
				setOpen(false);
			}
		};
		runScripts();
	};

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setBed(event.target.value as string);
	};

	return (
		<React.Fragment>
			<Title>Data Analysis</Title>
			<div className="row justify-content-between mt-3 px-4">
					<Typography variant="h5" className="col-4 file-list-title">
						Waiting List
					</Typography>
			</div>
			<FileList diseases={diseases}/>

			<div className="row justify-content-center mt-3">
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="demo-simple-select-outlined-label">Choose Bed</InputLabel>
					<Select
						labelId="demo-simple-select-outlined-label"
						id="demo-simple-select-outlined"
						value={bed}
						onChange={handleChange}
						label="Choose Bed"
					>
						{beds.map((bed) => {
							return <MenuItem value={bed}>{bed}</MenuItem>;
						})}
					</Select>
				</FormControl>
			</div>
			<div className="row justify-content-center mt-3">
				<Button variant="contained" color="primary" disabled={files.length === 0|| analysis>0 } onClick={handleClick}>
					開始分析
				</Button>
			</div>
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
