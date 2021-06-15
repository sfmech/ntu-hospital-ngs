import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React, { FunctionComponent, useContext } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import {
	CircularProgress,
	createStyles,
	makeStyles,
	Paper,
	TextField,
	Theme
} from '@material-ui/core';
import './NgsAnalysis.css';
import { Disease } from '../../models/disease.model';
import { FileContext } from '../../contexts/files.context';
import { File } from '../../models/file.model';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { FileStatus } from '../../models/file.state.enum';

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
	const { files, analysis, updateFile, updateFileInfo } = useContext(FileContext);
	const now = new Date(Date.now());
	const [selectedCheckDate, setSelectedCheckDate] = React.useState(`${now.getFullYear()}-${(now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);

	const handleChange = (event, newValue, file: File) => {
		if (newValue !== null) {
			let newFile = Object.assign(new File(), file);
			newFile.disease = newValue;
			updateFile(newFile);
		}
	};

	const handleInfoChange = (event, file: File) => {
		let newFile = Object.assign(new File(), file);
		const name = event.target.name;
		newFile[name] = event.target.value as string;
		updateFileInfo(newFile);
	};

	return (
		<div className="mt-4 px-4">
			<Paper className="mt-3" elevation={3}>
				<List>
					{files.map((file) => (
						<ListItem selected={file.status === FileStatus.Analysed} classes={{ selected: classes.listItemSelected }}>
							<ListItemIcon>
								<DescriptIcon />
							</ListItemIcon>
							<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
							{analysis === 0 ? (<>
								<TextField name="SID" className="col-2" label="SID" variant="outlined" value={file.SID} onChange={(event) => handleInfoChange(event, file)}/>
								<TextField name="medicalRecordNo" className="col-2 mx-2" label="病歷號" value={file.medicalRecordNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)}/>
								<TextField name="departmentNo" className="col-2 mx-2" label="科分號" value={file.departmentNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
								<TextField
											name="checkDate"
											label="檢查日期"
											type="date"
											defaultValue={selectedCheckDate}
											className="col-2 mx-2"
											onChange={(event) => handleInfoChange(event, file)}
											variant="outlined"
											InputLabelProps={{
											shrink: true,
											}}
								/>
								<Autocomplete
									options={props.diseases}
									getOptionLabel={(disease) => disease.enName}
									className="col-2"
									disableClearable
									defaultValue={file.disease}
									onChange={(event: any, newValue: Disease | null) => handleChange(event, newValue, file)}
									renderInput={(params) => (
										<TextField {...params} label="disease" variant="outlined" />
									)}
								/></>
							) : null}
							{file.status === FileStatus.Analysing ? <CircularProgress /> : null}
						</ListItem>
					))}
				</List>
			</Paper>
		</div>
	);
};
