import React, { FunctionComponent } from 'react';
import { CSVLink } from 'react-csv';
import cloneDeep from 'lodash/cloneDeep';


type CsvReport = {
	data: Array<any>;
	headers: Array<any>;
	onClose: ()=>void;
};

export const ExportDataToCsv: FunctionComponent<CsvReport> = (props) => {
	const now = new Date(Date.now())
	const cloneData = cloneDeep(props.data)
    const reportData = cloneData.map((d)=>{
		d.sampleName = d.sample.sampleName
		return d
	})
	const filename = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}.csv`
	console.log(props.headers)
	return (
		<CSVLink data={reportData} headers={props.headers} filename={filename} onClick={props.onClose}>
			{props.children}
		</CSVLink>
	);
};
