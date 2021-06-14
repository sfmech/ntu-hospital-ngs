import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { ApiUrl } from '../../constants/constants';
import axios from 'axios';
import { Disease } from '../../models/disease.model';
import { ClinicalSignificance } from '../../models/clinicalSignificance.enum';
import { SegmentTag } from '../../models/segmentTag.model';


type HotspotModalProps = {
	show: boolean;
	onClose: () => void;
};

export const HotspotModal: FunctionComponent<HotspotModalProps> = (props) => {
    const [ segmentTag, setSegmentTag ] = useState<SegmentTag>()
	useEffect(()=>{
		let segmentTag = new SegmentTag();
		segmentTag.chr = "";
		segmentTag.position = "";
		segmentTag.clinicalSignificance = ClinicalSignificance.Pathogenic;
		segmentTag.HGVSc = "";
		segmentTag.HGVSp = "";
		setSegmentTag(segmentTag);
	},[])

    
    const hadleAddClick = async () => {
        if (segmentTag?.HGVSp===undefined||segmentTag.geneName===undefined||segmentTag.remark===undefined){
            alert("Please completely fill the form.")
            return
        }
		try {
			await axios.post(`${ApiUrl}/api/addHotspotlist`, {
				data: [segmentTag]
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>, type: string) => {
        let temp = Object.assign(new SegmentTag(), segmentTag);
        temp[type]  = event.target.value as string;
		setSegmentTag(temp);
	};
	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Add new Hotspot</DialogTitle>
			<DialogContent dividers >
            <div className="row px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Gene Name:
					</Typography>
					<TextField
                        onChange={(e)=>handleInputChange(e, 'geneName')}
                        id='geneName'
						className="col-4"
					/>
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						HGVSc:
					</Typography>
                    <TextField
                        onChange={(e)=>handleInputChange(e, 'HGVSc')}
                        id='HGVSc'
                        className="col-4"
					/>
				</div>
                <div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						HGVSp :
					</Typography>
                    <TextField
                        onChange={(e)=>handleInputChange(e, 'HGVSp')}
                        id='HGVSp'
                        className="col-4"
					/>
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" >
						Clinical significance :
					</Typography>
					<FormControl variant="outlined">
						<Select
							labelId="demo-simple-select-outlined-label"
							value={segmentTag?.clinicalSignificance}
							name={'clinicalSignificance'}
							id='clinicalSignificance'
							onChange={(e) => handleInputChange(e, 'clinicalSignificance')}
						>
							{Object.keys(ClinicalSignificance).map((result) => {
								return (
									<MenuItem value={ClinicalSignificance[result]}>
										{ClinicalSignificance[result]}
									</MenuItem>
								);
							})}
						</Select>
					</FormControl>
				</div>
				<div className="row my-2 px-3">
					<Typography variant="h6" component="h2" className='col-8'>
						Remark :
					</Typography>
                    <TextField
                        onChange={(e)=>handleInputChange(e, 'remark')}
                        id='remark'
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
