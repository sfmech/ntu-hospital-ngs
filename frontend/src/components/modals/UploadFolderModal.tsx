import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';

type UploadFolderModalProps = {
	show: boolean;
	onClose: () => void;
};
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



export const UploadFolderModal: FunctionComponent<UploadFolderModalProps> = (props) => {
	const classes = useStyles();
	const [resultlist, setResultlist] = useState({ Myeloid: [], MPN: [], TP53: [], ABL1: [] });
	const [selectResult, setSelectResult] = useState<string>('');
	const [selectPanel, setSelectPanel] = useState<string>('Myeloid');
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

		getResultlist();
	}, []);
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectResult(event.target.value as string);
	};
	const handlePanelChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setSelectPanel(event.target.value as string);
	};

	const handleUploadResult = () => {
		const uploadResult = async () => {
			try {
				await axios.post(`${ApiUrl}/api/uploadresult`, {
					data: selectResult, bed: selectPanel
				});
			} catch (error) {
				console.log(error);
			} finally {
				window.location.reload();

			}
		};
		uploadResult();
	};
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Select upload folder</DialogTitle>
			<DialogContent dividers >

				<div className="row justify-content-center">
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel id="bed-label">Panel</InputLabel>
						<Select
							labelId="bed-label"
							id="bed"
							value={selectPanel}
							onChange={handlePanelChange}
							label="Panel"
						>
							{["Myeloid", "MPN", "TP53", "ABL1"].map((result) => {
								return <MenuItem value={result}>{result}</MenuItem>;
							})}
						</Select>
					</FormControl>

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
							{resultlist[selectPanel].map((result) => {
								return <MenuItem value={result}>{result}</MenuItem>;
							})}
						</Select>
					</FormControl>

				</div>
			</DialogContent>
			<DialogActions>
				<Button
					color="default"
					startIcon={<FolderOpenIcon />}
					onClick={handleUploadResult}
					disabled={resultlist[selectPanel].length <= 0 || selectResult === ''}
				>
					上傳
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
