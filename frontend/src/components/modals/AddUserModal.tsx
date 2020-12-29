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
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user.role.enum';

type AddUserModalProps = {
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

export const AddUserModal: FunctionComponent<AddUserModalProps> = (props) => {
	const classes = useStyles();
	const [ user, setUser ] = useState<User>();
    const hadleAddClick = async () => {
        if (user?.userName===undefined||user.password===undefined||user.userRole===undefined){
            alert("Please completely fill the form.")
            return
        }
		try {
			await axios.post(`${ApiUrl}/api/addUser`, {
				data: user
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload(false);
        }
    };
	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>, type: string) => {
		let temp = Object.assign(new User(), user);
		temp[type] = event.target.value as string;
		setUser(temp);
	};

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Add User</DialogTitle>
			<DialogContent className={classes.root} dividers>
				<div className="row px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Name:
					</Typography>
					<TextField onChange={(e) => handleInputChange(e, 'userName')} id="userName" className="col-4" />
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Password:
					</Typography>
					<TextField onChange={(e) => handleInputChange(e, 'password')} id="password" className="col-4" />
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className="col-8">
						Role :
					</Typography>
					<Select className="col-4"  id='userRole' onChange={(e) => handleInputChange(e, 'userRole')}>
						{Object.keys(UserRole).map((result) => {
							return <MenuItem value={UserRole[result]}>{UserRole[result]}</MenuItem>;
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
