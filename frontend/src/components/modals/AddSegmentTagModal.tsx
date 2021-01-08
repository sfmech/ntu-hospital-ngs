import { Button, createStyles, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Theme } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import { Segment } from '../../models/segment.model';
import { SegmentToSegmentTagTable } from '../table/SegmentToSegmentTagTable';

type AddSegmentTagModalProps = {
	show: boolean;
	onSave: (segments: Segment[]) => void;
	title: string;
	segments: Segment[];
	onClose: () => void;
};

export const AddSegmentTagModal: FunctionComponent<AddSegmentTagModalProps> = (props) => {
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
