import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	makeStyles,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@material-ui/core';
import { saveAs } from 'file-saver';
import ReactPDF, { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState, useContext } from 'react';
import { PdfDataContext } from '../../contexts/pdf-data.context';
import { PdfData } from '../../models/pdf.model';
import { Segment } from '../../models/segment.model';
import { MyDocument } from '../ngs-result/ExportPdf';
import { ExportPdfCollapsibleTable } from '../table/ExportPdfCollapsibleTable';
import { ApiUrl } from '../../constants/constants';
import { HealthCareWorkers } from '../../models/healthCareWorkers.model';
const XMLParser = require('react-xml-parser');

type ExportPdfModalProps = {
	show: boolean;
	exportData: Array<PdfData>;
	onClose: () => void;
};

const useStyles = makeStyles({
	table: {
		minWidth: 850
	}
});

function createData(name, calories, fat) {
	return { name, calories, fat };
}

const rows = [
	createData('Frozen yoghurt', 159, 6.0),
	createData('Ice cream sandwich', 237, 9.0),
	createData('Eclair', 262, 16.0),
	createData('Cupcake', 305, 3.7),
	createData('Gingerbread', 356, 16.0)
];

export const ExportPdfModal: FunctionComponent<ExportPdfModalProps> = (props) => {
	const classes = useStyles();
	const [ step, setStep ] = useState<number>(0);
	const { pdfData, setData } = useContext(PdfDataContext);
    const [memberlistgroupbyrole, setMemberlistgroupbyrole] = useState({'醫檢師':[], '主治醫師':[]});
    const [memberlist, setMemberlist] = useState<HealthCareWorkers[]>([]);

	useEffect(
		() => {
			setStep(0);     
            const getMemberlist = () => {
                try {
                    axios(`${ApiUrl}/api/getHealthCareWorkers`).then((res) => {
                        const memberlistgroupbyrole = res.data.reduce((groups, item) => {
                            const val = item.role;
                            groups[val] = groups[val] || [];
                            groups[val].push(item);
                            return groups;
                        }, {});		
                        setMemberlistgroupbyrole(memberlistgroupbyrole);
                        setMemberlist(res.data);
                    });
                } catch (error){
                    console.log(error);
                }
            }
            getMemberlist();       
		},
		[ props.show ]
	);
	const handleChange = (event) => {
		var reader = new FileReader();
		reader.onloadend = (event) => {
			const xml = new XMLParser().parseFromString(reader.result);
			console.log(xml);
		};
		reader.readAsText(event.target.files[0]);

		/*
        const formData = new FormData();
        formData.append('file', event.target.files);
        axios.post("http://localhost:8080/upload", formData);*/
	};

    const handleDownloadPdf =  () => {
        pdfData.forEach(async element => {
            const blob = await pdf((
                <MyDocument
                    data={element}
                    memberlist={memberlist}
                />
            )).toBlob();
            saveAs(blob, `${element.runName}-${element.sampleName}.pdf`);
            try {
                await axios.post(`${ApiUrl}/api/updateSample`, {
                    data: element.sample
                });
            } catch (error) {
                console.log(error);
            } 
        });
        props.onClose();
        
	};

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>匯出pdf</DialogTitle>
			<DialogContent dividers>
				{(() => {
					switch (step) {
						case 0:
							return <ExportPdfCollapsibleTable pdfData={pdfData} memberlist={memberlistgroupbyrole}/>;
					}
				})()}
			</DialogContent>
			<DialogActions>
				<Button variant="contained" color="primary" onClick={handleDownloadPdf}>
						匯出
				</Button>

				{(() => {
					switch (step) {
						case 0:
							return (
								<Button component="label" color="primary" disabled>
									匯入xml
									<input type="file" onChange={handleChange} hidden  disabled/>
								</Button>
							);
					}
				})()}

				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
