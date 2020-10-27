import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import { CircularProgress, createStyles, makeStyles, Paper, Theme } from '@material-ui/core';
import './NgsAnalysis.css';

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
	return (
			<div className="mt-4">
				<Typography variant="h5" className="file-list-title">
					Waiting List
				</Typography>
				<Paper className="mt-2" elevation={3}>
					<List>
						{props.files.map((file) => (
							<ListItem selected={file.status===1} classes={{ selected: classes.listItemSelected }}>
								<ListItemIcon>
									<DescriptIcon />
								</ListItemIcon>
								<ListItemText primary={file.name} />
								{file.status===2? <CircularProgress />:null}
							</ListItem>
						))}
					</List>
				</Paper>
			</div>
	);
};
