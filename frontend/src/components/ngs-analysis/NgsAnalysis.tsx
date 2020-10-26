import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import DescriptIcon from '@material-ui/icons/Description';
import ListItemText from '@material-ui/core/ListItemText';
import { Button, Paper } from '@material-ui/core';
import './NgsAnalysis.css'
const defaultFileList = ["744_S7_L001_R1_001.fastq.gz", "744_S7_L001_R2_001.fastq.gz", "1137_S8_L001_R1_001.fastq.gz", "1137_S8_L001_R2_001.fastq.gz"]


export const NgsAnalysis: FunctionComponent = (prop) => {
    const [files, setFiles] = useState<string[]>(defaultFileList)

    useEffect(()=>{
		// TODO: 後端抓取D:\NGS_Analysis的檔案（不包含子資料夾）
		if(defaultFileList.length>0){
			console.log(defaultFileList)
			setFiles(defaultFileList.map((file:string)=>file.split('_')[0]).filter((element, index, arr)=>arr.indexOf(element) === index))
		}
	},[]);

	return (
		<React.Fragment>
			<Title>Data Analysis</Title>
			<div className="mt-4">
				<Typography variant="h5" className='file-list-title'>Waiting List</Typography>
				<Paper className="mt-2" elevation={3}>
					<List>
						{files.map((file)=>(
							<ListItem>
								<ListItemIcon>
									<DescriptIcon />
								</ListItemIcon>
								<ListItemText primary={file} />
							</ListItem>
						))}
					</List>
				</Paper>
			</div>
            <div className="row justify-content-center mt-3">
                <Button variant="contained" color="primary" disabled={files.length===0}>開始分析</Button>
            </div>
		</React.Fragment>
	);
};
