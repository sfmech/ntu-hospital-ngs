import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Disease } from '../../models/disease.model';
import { DiseaseTable } from '../table/DisesaseTable';


export const DiseasesManage: FunctionComponent = (prop) => {
    const [ diseases, setDiseases ] = useState<Array<Disease>>([])
    
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
	return (
		<React.Fragment>
			<div className="row justify-content-center mt-3 px-4">
                <DiseaseTable data={diseases}></DiseaseTable>
			</div>
		</React.Fragment>
	);
};
