import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import { ApiUrl } from '../../constants/constants';
import axios from 'axios';
import { Disease } from '../../models/disease.model';


type DiseaseModalProps = {
	show: boolean;
	onClose: () => void;
};

export const DiseaseModal: FunctionComponent<DiseaseModalProps> = (props) => {
    const [ disease, setDisease ] = useState<Disease>()


    
    const hadleAddClick = async () => {
        if (disease?.abbr===undefined||disease.enName===undefined||disease.zhName===undefined){
            alert("Please completely fill the form.")
            return
        }
		try {
			await axios.post(`${ApiUrl}/api/addDisease`, {
				data: disease
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>, type: string) => {
        let temp = Object.assign(new Disease(), disease);
        temp[type]  = event.target.value as string;
		setDisease(temp);
	};
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Add new disease</DialogTitle>
			<DialogContent dividers >
            <div className="row px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Zh Name:
					</Typography>
					<TextField
                        onChange={(e)=>handleInputChange(e, 'zhName')}
                        id='zhName'
						className="col-4"
					/>
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						En Name:
					</Typography>
                    <TextField
                        onChange={(e)=>handleInputChange(e, 'enName')}
                        id='enName'
                        className="col-4"
					/>
				</div>
                <div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Abbr. :
					</Typography>
                    <TextField
                        onChange={(e)=>handleInputChange(e, 'abbr')}
                        id='abbr'
                        className="col-4"
					/>
				</div>
            </DialogContent>
			<DialogActions>
				<Button onClick={hadleAddClick} color="primary">
					新增
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
