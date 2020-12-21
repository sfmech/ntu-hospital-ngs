import { Button, Checkbox, createStyles, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, InputLabel, makeStyles, MenuItem, Radio, RadioGroup, Select, TextField, Theme, Typography } from '@material-ui/core';
import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Segment } from '../../models/segment.model';
import { SegmentTable } from '../table/SegmentTable';
import { SegmentToSegmentTagTable } from '../table/SegmentToSegmentTagTable';

type AddSegmentTagModalProps = {
	show: boolean;
	onSave: (segments: Segment[]) => void;
	title: string;
	segments: Segment[];
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
    


export const AddSegmentTagModal: FunctionComponent<AddSegmentTagModalProps> = (props) => {
	const classes = useStyles();
	const [saveSegments, setSaveSegments] = useState<Array<Segment>>(props.segments)
	useEffect(()=>{
		console.log(saveSegments);
		setSaveSegments(props.segments);
	},[props.segments])
    
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Insert into {props.title}</DialogTitle>
			<DialogContent dividers >
				<div className="row justify-content-center">
					<SegmentToSegmentTagTable data={saveSegments} title={""} setSaveSegments={setSaveSegments} />
				</div>
            </DialogContent>
			<DialogActions>
            	<Button
				 	color="primary"
					startIcon={<FolderOpenIcon />}
					onClick={()=>{props.onSave(saveSegments);props.onClose();}}
				>
					儲存
				</Button>
				<Button onClick={props.onClose} color="secondary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
