import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import './NgsAnalysis.css';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { FileList } from './fileList';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		}
	})
);

type FileResponse = {
	analysis: number;
	files: Array<{ status: number; name: string }>;
};

export const NgsAnalysis: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ open, setOpen ] = React.useState(false);

	const [ fileResponse, setFileResponse ] = useState<FileResponse>({ analysis: 0, files: [] });
	
	useEffect(() => {
		const getFilelist = () => {
			try {
				axios(`${ApiUrl}/api/filelist`).then((res) => {
					if (res.data.files.length > 0) {
						setFileResponse(res.data);
					}
				});
			} catch (error) {
				console.log(error);
			}
		};
		getFilelist();
		setInterval(() => getFilelist(), 3000);
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
			<FileList files={fileResponse.files} />
			<div className="row justify-content-center mt-3">
				<Button
					variant="contained"
					color="primary"
					disabled={fileResponse.files.length === 0 || fileResponse.analysis > 0}
					onClick={handleClick}
				>
					開始分析
				</Button>
			</div>
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
