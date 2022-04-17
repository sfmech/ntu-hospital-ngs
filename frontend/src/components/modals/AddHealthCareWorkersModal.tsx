import {
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	MenuItem,
	Select,
	TextField,
	Theme,
	Typography
} from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Sample } from '../../models/sample.model';
import { Disease } from '../../models/disease.model';
import { Autocomplete } from '@material-ui/lab';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
import { HealthCareWorkerRole } from '../../models/healthCareWorker.role.enum';



type AddHealthCareWorkersModalProps = {
	show: boolean;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400
		}
	})
);

export const AddHealthCareWorkersModal: FunctionComponent<AddHealthCareWorkersModalProps> = (props) => {
	const classes = useStyles();
	const [ user, setUser ] = useState<HealthCareWorkers>();
    const hadleAddClick = async () => {
        if (user?.name===undefined||user.number===undefined||user.role===undefined){
            alert("Please completely fill the form.")
            return
        }
		try {
			await axios.post(`${ApiUrl}/api/addHealthCareWorkers`, {
				data: user
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload();
        }
    };
	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>, type: string) => {
		let temp = Object.assign(new HealthCareWorkers(), user);
		temp[type] = event.target.value as string;
		setUser(temp);
	};

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Add Healthcare Worker</DialogTitle>
			<DialogContent className={classes.root} dividers>
				<div className="row px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Name:
					</Typography>
					<TextField onChange={(e) => handleInputChange(e, 'name')} id="name" className="col-4" />
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Number:
					</Typography>
					<TextField onChange={(e) => handleInputChange(e, 'number')} id="number" className="col-4" />
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Role :
					</Typography>
					<Select className="col-4"  id='role' onChange={(e) => handleInputChange(e, 'role')}>
						{Object.keys(HealthCareWorkerRole).map((result) => {
							return <MenuItem value={HealthCareWorkerRole[result]}>{HealthCareWorkerRole[result]}</MenuItem>;
						})}
					</Select>
				</div>
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
