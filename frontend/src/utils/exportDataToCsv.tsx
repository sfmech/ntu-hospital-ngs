import React, { FunctionComponent } from 'react';
import { CSVLink } from 'react-csv';
import cloneDeep from 'lodash/cloneDeep';


type CsvReport = {
	data: Array<any>;
	headers?: Array<any>;
	fileName?: string;
	onClose?: ()=>void;
	style?;
};

export const ExportDataToCsv: FunctionComponent<CsvReport> = (props) => {
	const now = new Date(Date.now())

	return (
		<CSVLink data={props.data} headers={props.headers?props.headers:null} filename={props.fileName} onClick={props.onClose} style={props.style}>
			{props.children}
		</CSVLink>
	);
};
