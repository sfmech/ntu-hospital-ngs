import React, { FunctionComponent, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Disease } from '../../models/disease.model';
import { DiseaseTable } from '../table/DisesaseTable';
import { Button } from '@material-ui/core';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { ExportDataToCsv } from '../../utils/exportDataToCsv';
import DescriptIcon from '@material-ui/icons/Description';
import { UploadCSVModal } from '../modals/UploadCsvModal';
const prettyLink  = {
	color: '#fff'
  };

export const DiseasesManage: FunctionComponent = (prop) => {
    const [ diseases, setDiseases ] = useState<Array<Disease>>([])
	const [ showImportCSVModal, setShowImportCSVModal] = useState(false);
	const now = new Date(Date.now())

    useEffect(() => {
		const getDiseases = () => {
			try {
				axios(`${ApiUrl}/api/getDiseases`).then((res) => {
                    res.data.splice(0,1);
					setDiseases(res.data);
				});
			} catch (error){
				console.log(error);
			}
		}
		getDiseases();
	}, []);
	const handleImportClick = (data)=>{
		const importData = data.filter((d)=>
			!diseases.find((curD)=>curD.abbr === d.abbr && curD.enName === d.enName && curD.zhName === d.zhName)
		);
		console.log(importData)
		if(importData.length>0){
			axios.post(`${ApiUrl}/api/addDisease`, {
				data:  importData
			}).then(()=>{
				window.location.reload();
			})
		}
	};
	return (
		<React.Fragment>
			<div className="row ml-3 mt-3">	
				<Button
					variant="contained"
					color="primary"
					startIcon={<ImportExportIcon />}
					className={"mx-2"}
				>
					<ExportDataToCsv fileName={`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}_disease.csv`} data={diseases} style={prettyLink}>
                    	匯出
                	</ExportDataToCsv>
				</Button>

				<Button
					variant="contained"
					color="primary"
					startIcon={<DescriptIcon />}
					className={"mx-2"}
					onClick={()=>setShowImportCSVModal(true)}
				>
					上傳
				</Button>
			</div>
			<div className="row justify-content-center mt-3 px-4">
                <DiseaseTable data={diseases}></DiseaseTable>
			</div>
			<UploadCSVModal handleImportClick={handleImportClick} show={showImportCSVModal} onClose={() => setShowImportCSVModal(false)} />
		</React.Fragment>
	);
};
