import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import CSVReader from 'react-csv-reader';

type UploadCSVModalProps = {
    show: boolean;
	onClose: () => void;
	handleImportClick: (data) => void;
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
    


export const UploadCSVModal: FunctionComponent<UploadCSVModalProps> = (props) => {
    const classes = useStyles();
    const [ data, setData ] = useState(Array<any>());

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Select upload CSV</DialogTitle>
			<DialogContent dividers >
			
				<div className="row justify-content-center">
				<CSVReader onFileLoaded={(data, fileInfo) => setData(data)} parserOptions={{header:true}} ></CSVReader>
				</div>
            </DialogContent>
			<DialogActions>
            	<Button
						color="default"
						startIcon={<DescriptIcon />}
						onClick={()=>{props.handleImportClick(data);props.onClose()}}
						disabled={data.length <= 0 || data===undefined}
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
