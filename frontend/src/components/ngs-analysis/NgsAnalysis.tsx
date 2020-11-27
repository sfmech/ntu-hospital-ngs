import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import { Button, createStyles, makeStyles, Paper, Theme, Typography } from '@material-ui/core';
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
		}
	})
);



export const NgsAnalysis: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);
	const [ diseases, setDiseases ] = useState<Array<Disease>>([])
	const { analysis, files } = useContext(FileContext);


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
				const response = await axios.post(`${ApiUrl}/api/runscript`);
			} catch (error) {
				console.log(error);
			} finally {
				setOpen(false);
			}
		};
		runScripts();
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
