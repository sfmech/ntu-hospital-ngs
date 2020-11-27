import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React, { FunctionComponent, useContext, useState } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import {
	CircularProgress,
	createStyles,
	FormControl,
	InputLabel,
	makeStyles,
	Paper,
	Select,
	TextField,
	Theme
} from '@material-ui/core';
import './NgsAnalysis.css';
import { Disease } from '../../models/disease.model';
import { FileContext } from '../../contexts/files.context';
import { File } from '../../models/file.model';
import Autocomplete from '@material-ui/lab/Autocomplete';

type FileListProp = {
	diseases: Array<Disease>;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		listItemSelected: {
			backgroundColor: '#76ff03 !important'
		}
	})
);

export const FileList: FunctionComponent<FileListProp> = (props) => {
	const classes = useStyles();
	const [ selectedSample, setSelectedSample ] = useState<string>('');
	const [ showModal, setShowModal ] = useState(false);
	const { files, analysis, updateFile } = useContext(FileContext);

	const handleChange = (newValue, file: File) => {
		if (newValue !== null) {
			let newFile = Object.assign(new File(), file);
			newFile.disease = newValue;
			updateFile(newFile);
		}
	};

	return (
		<div className="mt-4 px-4">
			<Paper className="mt-3" elevation={3}>
				<List>
					{files.map((file) => (
						<ListItem selected={file.status === 1} classes={{ selected: classes.listItemSelected }}>
							<ListItemIcon>
								<DescriptIcon />
							</ListItemIcon>
							<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
							{analysis === 0 ? (
								<Autocomplete
									options={props.diseases}
									getOptionLabel={(disease) => disease.enName}
									className="col-3"
									disableClearable
									defaultValue={file.disease}
									onChange={(event: any, newValue: Disease | null) => handleChange(newValue, file)}
									renderInput={(params) => (
										<TextField {...params} label="disease" variant="outlined" />
									)}
								/>
							) : null}
							{file.status === 2 ? <CircularProgress /> : null}
						</ListItem>
					))}
				</List>
			</Paper>
		</div>
	);
};
