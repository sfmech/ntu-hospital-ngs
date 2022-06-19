import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Radio, RadioGroup } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { Orders } from '../../models/orders.enum';
import { ApiUrl } from '../../constants/constants';
import { ExportDataToCsv } from '../../utils/exportDataToCsv';
import axios from 'axios';


type ExportModalProps = {
    show: boolean;
    exportData: Array<any>;
	onClose: () => void;
};

const headers = [
    { label: 'SID', key: 'SID' },
	{ label: 'Sample Name', key: 'sampleName'},
	{ label: 'Chr', key: 'chr' },
	{ label: 'Position', key: 'position' },
	{ label: 'dbSNP', key: 'dbSNP' },
	{ label: 'Freq', key: 'freq' },
	{ label: 'Depth', key: 'depth' },
	{ label: 'Annotation', key: 'annotation' },
	{ label: 'Gene_Name', key: 'geneName' },
	{ label: 'HGVS.c', key: 'HGVSc' },
	{ label: 'HGVS.p', key: 'HGVSp' },
	{ label: 'Clinical significance', key: 'clinicalSignificance' },
	{ label: 'Global_AF', key: 'globalAF' },
	{ label: 'AFR_AF', key: 'AFRAF' },
	{ label: 'AMR_AF', key: 'AMRAF' },
	{ label: 'EUR_AF', key: 'EURAF' },
    { label: 'ASN_AF', key: 'ASNAF' },
    { label: 'Remark', key: 'alert' },
    { label: 'Assay', key: 'Assay' },
    { label: 'P/N', key: 'PN' },
];
export const ExportModal: FunctionComponent<ExportModalProps> = (props) => {
    const [ step, setStep] = useState<number>(0)
    const now = new Date(Date.now())

    const [ template, setTemplate] = useState<number>(0)
    const LISHeader = {
        sampleName: false,
        chr: false,
        position:false,
        dbSNP: false,
        freq:true,
        depth:false,
        annotation:false,
        geneName:true,
        HGVSc: true,
        HGVSp: true,
        clinicalSignificance: false,
        globalAF: false,
        AFRAF: false,
        AMRAF: false,
        EURAF: false,
        ASNAF: false,
        alert: false,
        SID: true,
        Assay: true,
        PN: true
    }
    const [ header, setHeader] = useState({
        sampleName: true,
        chr: true,
        position:true,
        dbSNP: true,
        freq:true,
        depth:true,
        annotation:true,
        geneName:true,
        HGVSc:  true,
        HGVSp: true,
        clinicalSignificance: true,
        globalAF: true,
        AFRAF: true,
        AMRAF: true,
        EURAF: true,
        ASNAF: true,
        alert: false,
        SID: false,
        Assay: false,
        PN: false
    })
    useEffect(()=>{
        setStep(0);
        setTemplate(0);
    },[props.show])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeader({ ...header, [event.target.name]: event.target.checked });
      };

    const getAssay = (geneName: string, HGVSp: string) => {
        if(geneName == 'JAK2') {
            let matchResult = HGVSp.match(/\d+/);
            if(matchResult != null) {
                let HGVSpNumber = parseInt(matchResult[0]);
                if (HGVSpNumber >= 505 && HGVSpNumber <= 547) {
                    return Orders['JAK2_505547'];
                } else if (HGVSpNumber >= 593 && HGVSpNumber <= 622) {
                    return Orders['JAK2_593622'];
                } else {
                    return null;
                }
            } else {
                return; 
            }
        } else {
            return Orders[geneName];
        }
    }

    const handleExportLIE = async (header: any[], rowData: any[]) => {
        try {
			await axios.post(`${ApiUrl}/api/downloadliscsv`, {
                rowData: rowData,
				header: header,
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload();
        }
    }

    const LISDataFilter = (exportData: Array<any>) => {
        const dataGroupBySID = exportData.reduce((group, data) => {
            const SID = data.sample.SID;
            group[SID] = group[SID] ?? [];
            group[SID].push(data);
            return group;
        }, {});

        Object.keys(dataGroupBySID).map(key => {
            let negative = dataGroupBySID[key].every(data => { return !['Pathogenic', 'VUS'].includes(data.clinicalSignificance) });
            if (negative) {
                dataGroupBySID[key] = [dataGroupBySID[key][0]]
            }
            dataGroupBySID[key].map(data => {
                const assay = getAssay(data.geneName, data.HGVSp);
                if(!assay) { return null }

                data.sampleName = data.sample.sampleName;
                data.SID = data.sample.SID;
                data.Assay = assay
                data.PN = negative ? 'N' : 'P';
                return data;
            })
        });

        return Object.values(dataGroupBySID).flat(Infinity).filter(data => { return data !== null; });
    }

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Select export Template</DialogTitle>
			<DialogContent dividers >
                {(()=>{
                     switch (step) {
                        case 0:
                            return (
                                <RadioGroup row aria-label="position" name="position" defaultValue="top">
                                    <FormControlLabel
                                    value="0"
                                    control={<Radio color="primary" checked={template===0} />}
                                    onChange={()=>setTemplate(0)}
                                    label="自選欄位"
                                    labelPlacement="top"
                                    />
                                    <FormControlLabel
                                    value="1"
                                    control={<Radio color="primary" checked={template===1}/>}
                                    onChange={()=>setTemplate(1)}
                                    label="LIS 套版"
                                    labelPlacement="top"
                                    />
                                </RadioGroup>)
                        case 1:
                            return (
                                <FormGroup>
                                    {
                                        headers.map((h)=>
                                            h.key!=='alert'?
                                            <FormControlLabel
                                                control={<Checkbox checked={header[h.key]} onChange={handleChange} name={h.key} />}
                                                label={h.label}
                                            />:null
                                        )
                                    }

                                </FormGroup>
                            )
                     }
                    })()
                }
      
        
            </DialogContent>
			<DialogActions>
                { step===0&&template===0?
				<Button onClick={()=>setStep(1)} color="primary">
					確認
                </Button>:(template===1?
                <Button onClick={()=>handleExportLIE(headers.filter((h)=>LISHeader[h.key]), LISDataFilter(props.exportData))}>
                    匯出
                </Button>:
                <ExportDataToCsv fileName={`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}.csv`} data={props.exportData.map((d)=>{
                    d.sampleName = d.sample.sampleName;
                    return d;
                })} onClose={props.onClose} headers={headers.filter((h)=>header[h.key])}>
                    匯出
                </ExportDataToCsv>)
                }
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
