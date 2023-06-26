import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import React, { FunctionComponent, useContext, useEffect } from 'react';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import {
	Checkbox,
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
	merge: boolean;
	diseases: Array<Disease>;
	bed: string;
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
	const now = new Date(Date.now());
	const { Mergefiles, Myeloidanalysis, MPNanalysis, TP53analysis, ABL1analysis, Myeloidfiles, MPNfiles, TP53files, ABL1files, updateFile, updateFileInfo, setMergeFiles } = useContext(FileContext);
	const [selectedCheckDate, setSelectedCheckDate] = React.useState(`${now.getFullYear()}-${(now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);
	const handleToggle = (value: File) => () => {
		if (props.merge) {
			const currentIndex = Mergefiles.indexOf(value.name);
			const newChecked = [...Mergefiles];

			if (currentIndex === -1) {
				newChecked.push(value.name);
			} else {
				newChecked.splice(currentIndex, 1);
			}

			setMergeFiles(newChecked);
		}
	};

	const handleChange = (event, newValue, file: File) => {
		if (newValue !== null) {
			let newFile = Object.assign(new File(), file);
			newFile.disease = newValue;
			updateFile({ file: newFile, bed: props.bed });
		}
	};

	const handleInfoChange = (event, file: File) => {
		let newFile = Object.assign(new File(), file);
		const name = event.target.name;
		newFile[name] = event.target.value as string;
		updateFileInfo({ file: newFile, bed: props.bed });
	};

	return (
		<div className="mt-4 px-4">
			<Paper className="mt-3" elevation={3}>
				<List>
					{props.bed === "Myeloid" ? Myeloidfiles.map((file) => (
						<ListItem key={file.name} onClick={handleToggle(file)} selected={file.status === FileStatus.Analysed} classes={{ selected: classes.listItemSelected }}>
							<ListItemIcon>
								{props.merge ? <Checkbox
									edge="start"
									checked={Mergefiles.indexOf(file.name) !== -1}
									tabIndex={-1}
									disableRipple
								/> : null}
								<DescriptIcon />
							</ListItemIcon>
							<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
							{Myeloidanalysis === 0 ? (
								<>

									<TextField name="SID" className="col-2" label="SID" variant="outlined" defaultValue={file.SID} onChange={(event) => handleInfoChange(event, file)} />
									<TextField name="medicalRecordNo" className="col-2 mx-2" label="病歷號" defaultValue={file.medicalRecordNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
									<TextField name="departmentNo" className="col-2 mx-2" label="科分號" defaultValue={file.departmentNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
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
					)) : props.bed === "MPN" ? MPNfiles.map((file) => (
						<ListItem key={file.name} onClick={handleToggle(file)} selected={file.status === FileStatus.Analysed} classes={{ selected: classes.listItemSelected }}>
							<ListItemIcon>
								{props.merge ? <Checkbox
									edge="start"
									checked={Mergefiles.indexOf(file.name) !== -1}
									tabIndex={-1}
									disableRipple
								/> : null}
								<DescriptIcon />
							</ListItemIcon>
							<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
							{MPNanalysis === 0 ? (<>
								<TextField name="SID" className="col-2" label="SID" variant="outlined" defaultValue={file.SID} onChange={(event) => handleInfoChange(event, file)} />
								<TextField name="medicalRecordNo" className="col-2 mx-2" label="病歷號" defaultValue={file.medicalRecordNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
								<TextField name="departmentNo" className="col-2 mx-2" label="科分號" defaultValue={file.departmentNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
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
						</ListItem>)) :
						props.bed === "ABL1" ? MPNfiles.map((file) => (
							<ListItem key={file.name} onClick={handleToggle(file)} selected={file.status === FileStatus.Analysed} classes={{ selected: classes.listItemSelected }}>
								<ListItemIcon>
									{props.merge ? <Checkbox
										edge="start"
										checked={Mergefiles.indexOf(file.name) !== -1}
										tabIndex={-1}
										disableRipple
									/> : null}
									<DescriptIcon />
								</ListItemIcon>
								<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
								{ABL1analysis === 0 ? (<>
									<TextField name="SID" className="col-2" label="SID" variant="outlined" defaultValue={file.SID} onChange={(event) => handleInfoChange(event, file)} />
									<TextField name="medicalRecordNo" className="col-2 mx-2" label="病歷號" defaultValue={file.medicalRecordNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
									<TextField name="departmentNo" className="col-2 mx-2" label="科分號" defaultValue={file.departmentNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
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
							</ListItem>)) : TP53files.map((file) => (
								<ListItem key={file.name} onClick={handleToggle(file)} selected={file.status === FileStatus.Analysed} classes={{ selected: classes.listItemSelected }}>
									<ListItemIcon>
										{props.merge ? <Checkbox
											edge="start"
											checked={Mergefiles.indexOf(file.name) !== -1}
											tabIndex={-1}
											disableRipple
										/> : null}
										<DescriptIcon />
									</ListItemIcon>
									<ListItemText primary={file.name.split('_')[0]} secondary={file.disease.enName} />
									{TP53analysis === 0 ? (<>
										<TextField name="SID" className="col-2" label="SID" variant="outlined" defaultValue={file.SID} onChange={(event) => handleInfoChange(event, file)} />
										<TextField name="medicalRecordNo" className="col-2 mx-2" label="病歷號" defaultValue={file.medicalRecordNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
										<TextField name="departmentNo" className="col-2 mx-2" label="科分號" defaultValue={file.departmentNo} variant="outlined" onChange={(event) => handleInfoChange(event, file)} />
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

								</ListItem>))
					}
				</List>
			</Paper>
		</div>
	);
};
