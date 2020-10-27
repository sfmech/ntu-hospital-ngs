import React, { FunctionComponent } from 'react';
import { CSVLink } from 'react-csv';
import cloneDeep from 'lodash/cloneDeep';

const headers = [
	{ label: 'Chr', key: 'chr' },
	{ label: 'Position', key: 'position' },
	{ label: 'dbSNP', key: 'dbSNP' },
	{ label: 'Freq', key: 'freq' },
	{ label: 'Depth', key: 'depth' },
	{ label: 'Annotation', key: 'annotation' },
	{ label: 'Gene_Name', key: 'geneName' },
	{ label: 'HGVS.c', key: 'HGVSc' },
	{ label: 'HGVS.p', key: 'HGVSp' },
	{ label: 'Clinical significance', key: 'clinicalSignificanceclinicalSignificance' },
	{ label: 'Global_AF', key: 'globalAF' },
	{ label: 'AFR_AF', key: 'AFRAF' },
	{ label: 'AMR_AF', key: 'AMRAF' },
	{ label: 'EUR_AF', key: 'EURAF' },
	{ label: 'ASN_AF', key: 'ASNAF' }
];

type CsvReport = {
	data: Array<any>;
};

export const ExportDataToCsv: FunctionComponent<CsvReport> = (props) => {
	const now = new Date(Date.now())
	const cloneData = cloneDeep(props.data)
    const reportData = cloneData.map((d)=>{
        d.freq=d.freq+"%"
        return d
    })
    const filename = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}.csv`
	return (
		<CSVLink data={reportData} headers={headers} filename={filename}>
			{props.children}
		</CSVLink>
	);
};
