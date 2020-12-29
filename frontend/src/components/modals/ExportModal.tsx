import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Radio, RadioGroup } from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import { ExportDataToCsv } from '../../utils/exportDataToCsv';


type ExportModalProps = {
    show: boolean;
    exportData: Array<any>;
	onClose: () => void;
};

const headers = [
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
    { label: 'Remark', key: 'alert' }
];
export const ExportModal: FunctionComponent<ExportModalProps> = (props) => {
    const [ step, setStep] = useState<number>(0)
    const [ template, setTemplate] = useState<number>(0)
    const LISHeader = {
        sampleName: true,
        chr: false,
        position:false,
        dbSNP: false,
        freq:true,
        depth:true,
        annotation:false,
        geneName:true,
        HGVSc:  false,
        HGVSp: true,
        clinicalSignificance: true,
        globalAF: false,
        AFRAF: false,
        AMRAF: false,
        EURAF: false,
        ASNAF: false,
        alert: true
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
        alert: false
    })
    useEffect(()=>{
        setStep(0);
        setTemplate(0);
    },[props.show])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHeader({ ...header, [event.target.name]: event.target.checked });
      };
    
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
                <ExportDataToCsv data={props.exportData} onClose={props.onClose} headers={headers.filter((h)=>LISHeader[h.key])}>
                    匯出
                </ExportDataToCsv>:
                <ExportDataToCsv data={props.exportData} onClose={props.onClose} headers={headers.filter((h)=>header[h.key])}>
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
