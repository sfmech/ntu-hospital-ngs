import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useState } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import { CircularProgress, createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import './NgsAnalysis.css';
import { AnalysisModal } from '../modals/AnalysisFileModal';

type FileListProp={
    files: Array< {status:number, name:string}>
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		listItemSelected: {
			backgroundColor: "#76ff03 !important" ,
		  },
	})
);

export const FileList: FunctionComponent<FileListProp> = (props) => {
	const classes = useStyles();
	const [ selectedSample, setSelectedSample] = useState<string>("");
	const [ showModal, setShowModal ] = useState(false);

	

	const handleClick = (disease:string) => {
		setSelectedSample(disease);
		setShowModal(true);
	};
	return (
			<div className="mt-4">
				<Typography variant="h5" className="file-list-title">
					Waiting List
				</Typography>
				<Paper className="mt-2" elevation={3}>
					<List>
						{props.files.map((file) => (
							<ListItem selected={file.status===1} classes={{ selected: classes.listItemSelected }} button onClick={()=>handleClick(file.name)}>
								<ListItemIcon>
									<DescriptIcon />
								</ListItemIcon>
								<ListItemText primary={file.name} />
								{file.status===2? <CircularProgress />:null}
							</ListItem>
						))}
					</List>
				</Paper>
				<AnalysisModal show={showModal} onClose={() => setShowModal(false)} disease={selectedSample}/>
			</div>
	);
};
