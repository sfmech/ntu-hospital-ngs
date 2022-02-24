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
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Sample } from '../../models/sample.model';
import { Disease } from '../../models/disease.model';
import { Autocomplete } from '@material-ui/lab';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user.role.enum';
import { FileContext } from '../../contexts/files.context';

type MergeFilesModalProps = {
	show: boolean;
	bed: string;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400
		}
	})
);

export const MergeFilesModal: FunctionComponent<MergeFilesModalProps> = (props) => {
	const classes = useStyles();
	const [ user, setUser ] = useState<string>();
	const [ open, setOpen ] = React.useState(false);
	const { Mergefiles, setMergeFiles } = useContext(FileContext);

    const handleClickMergeConfirm = async (files, bed)=>{
		console.log(user)
        try {
			setOpen(true);
			await axios.post(`${ApiUrl}/api/merge`, {data: files, bed: bed, fileName: user});
		} catch (error) {
			console.log(error);
		} finally {
			setOpen(false);
		}
		setMergeFiles([]);
		props.onClose();
    };
	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setUser(event.target.value as string);
	};

	return (
		<Dialog maxWidth="xl" open={props.show} >
			<DialogTitle>Merge Files</DialogTitle>
			<DialogContent className={classes.root} dividers>
				<div className="row px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Sample Name:
					</Typography>
					<TextField onChange={(e) => handleInputChange(e)} id="userName" disabled={open} className="col-4" />
				</div>
			</DialogContent>
			<DialogActions>
				<Button onClick={()=>handleClickMergeConfirm(Mergefiles, props.bed)} disabled={open} color="primary">
					儲存
				</Button>
				<Button onClick={props.onClose} disabled={open} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
