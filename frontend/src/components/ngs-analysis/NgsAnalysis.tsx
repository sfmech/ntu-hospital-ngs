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

	const [ files, setFiles ] = useState<string[]>([]);

	useEffect(() => {
		const getFilelist = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/filelist`);
				if (response.data.length > 0) {
					setFiles(
						response.data
							.map((file: string) => file.split('_')[0])
							.filter((element, index, arr) => arr.indexOf(element) === index)
					);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getFilelist();
	}, []);

	const handleClick = () =>{
		const runScripts = async () => {
			try {
				setOpen(true);
				const response = await axios.post(`${ApiUrl}/api/runscript`);
			} catch (error) {
				console.log(error);
			}finally {
				setOpen(false);
			}
		};
		runScripts();
	}

	return (
		<React.Fragment>
			<Title>Data Analysis</Title>
			<div className="mt-4">
				<Typography variant="h5" className="file-list-title">
					Waiting List
				</Typography>
				<Paper className="mt-2" elevation={3}>
					<List>
						{files.map((file) => (
							<ListItem>
								<ListItemIcon>
									<DescriptIcon />
								</ListItemIcon>
								<ListItemText primary={file} />
							</ListItem>
						))}
					</List>
				</Paper>
			</div>
			<div className="row justify-content-center mt-3">
				<Button variant="contained" color="primary" disabled={files.length === 0} onClick={handleClick}>
					開始分析
				</Button>
			</div>
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
