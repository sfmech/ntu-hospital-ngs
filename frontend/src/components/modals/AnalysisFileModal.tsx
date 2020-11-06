import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	TextField,
	Typography
} from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';

type AnalysisFileModalProps = {
	show: boolean;
	disease: string;
	onClose: () => void;
};

export const AnalysisModal: FunctionComponent<AnalysisFileModalProps> = (props) => {
	const [ input, setInput ] = useState('_');
	useEffect(
		() => {
            if(props.disease.indexOf("_")!==-1)
			    setInput(props.disease.split("_")[1].match(/S(\d)*/)?"unknown":props.disease.split("_")[1]);
		},
		[ props.disease ]
	);

    const handleSaveClick = async () => {
        if (!input.match(/S(\d)*/) || input!=="unknown"){
            try {
				const response = await axios.post(`${ApiUrl}/api/updateFileName`);
			} catch (error) {
				console.log(error);
			}
        }
		
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Rename disease</DialogTitle>
			<DialogContent dividers>
				<div className="row px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Sequence Number:
					</Typography>
					<TextField
						disabled
						defaultValue={props.disease.split('_')[0]}
						className="col-4"
					/>
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Disease:
					</Typography>
                    <TextField
                        value={input}
                        onChange={handleInputChange}
                        placeholder="disease or unknown"
                        className="col-4"
					/>
				</div>
			</DialogContent>

			<DialogActions>
				<Button onClick={handleSaveClick} color="primary">
					Save
				</Button>
				<Button onClick={props.onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};
