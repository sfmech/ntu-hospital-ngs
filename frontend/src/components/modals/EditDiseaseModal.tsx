import {
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	TextField,
	Theme,
} from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Sample } from '../../models/sample.model';
import { Disease } from '../../models/disease.model';
import { Autocomplete } from '@material-ui/lab';

type EditDiseaseModalProps = {
	show: boolean;
	sample: Sample;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400,
			
		}
    })
);

export const EditDiseaseModal: FunctionComponent<EditDiseaseModalProps> = (props) => {
    const classes = useStyles();
	const [ diseases, setDiseases ] = useState<Array<Disease>>([]);
	const [ selectedDisease, setSelectedDisease ] = useState<Disease>(props.sample.disease);

	useEffect(() => {
		const getDiseases = () => {
			try {
				axios(`${ApiUrl}/api/getDiseases`).then((res) => {
					setDiseases(res.data);
				});
			} catch (error) {
				console.log(error);
			}
		};
		getDiseases();
	}, []);
	const hadleAddClick = async () => {
		try {
			props.sample.disease = selectedDisease;
			await axios.post(`${ApiUrl}/api/editSampleDisease`, {
				data: props.sample
			});
		} catch (error) {
			console.log(error);
		} finally {
			props.onClose();
		}
	};
	const handleChange = (newValue) => {
		setSelectedDisease(newValue);
	};
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Edit Disease</DialogTitle>
			<DialogContent className={classes.root} dividers>
				<Autocomplete
					options={diseases}
					getOptionLabel={(disease) => disease.abbr}
                    defaultValue={props.sample.disease}
                    disableClearable
					onChange={(event: any, newValue: Disease | null) => handleChange(newValue)}
					renderInput={(params) => <TextField {...params} label="disease" variant="outlined" />}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={hadleAddClick} color="primary">
					儲存
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
