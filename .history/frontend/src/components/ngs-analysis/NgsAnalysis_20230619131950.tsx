import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import { AppBar, Box, Button, createStyles, makeStyles, Tab, Tabs, Theme, Typography } from '@material-ui/core';
import './NgsAnalysis.css';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { FileList } from './fileList';
import { Disease } from '../../models/disease.model';
import { FileContext } from '../../contexts/files.context';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { MergeFilesModal } from '../modals/MergeFilesModal';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		backdrop: {
			zIndex: theme.zIndex.drawer + 1,
			color: '#fff'
		}
	})
);



export const NgsAnalysis: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [merge, setMerge] = React.useState(false);
	const [diseases, setDiseases] = useState<Array<Disease>>([]);
	const { Mergefiles, Myeloidanalysis, MPNanalysis, TP53analysis, ABL1analysis, Myeloidfiles, MPNfiles, TP53files, ABL1files, setMergeFiles } = useContext(FileContext);
	const [value, setValue] = React.useState("Myeloid");
	const [showModal, setShowModal] = React.useState(false);


	useEffect(() => {
		const getDiseases = () => {
			try {
				axios(`${ApiUrl}/api/getDiseases`).then((res) => {
					setDiseases(res.data);
				});
			} catch (error) {
				console.log(error);
			}
		}
		getDiseases();
	}, []);


	const handleClick = (files, bed) => {
		const runScripts = async () => {
			try {
				setOpen(true);
				await axios.post(`${ApiUrl}/api/runscript`, { data: files, bed: bed });
			} catch (error) {
				console.log(error);
			} finally {
				setOpen(false);
			}
		};
		runScripts();
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
		setMerge(false);
		setMergeFiles([]);

	};

	const handleClickMerge = () => {
		setMerge(!merge);
		setMergeFiles([]);
	};
	const handleClickMergeConfirm = () => {
		setShowModal(true);
	};

	return (
		<React.Fragment>
			<Title>Data Analysis</Title>
			<div className="row justify-content-between mt-3 px-4">
				<Typography variant="h5" className="col-4 file-list-title">
					Waiting List
				</Typography>
			</div>
			<TabContext value={value}>
				<AppBar position="static" id="back-to-top-anchor">
					<TabList value={value} onChange={handleChange}>
						<Tab value="Myeloid" label="Myeloid Panel" />
						<Tab value="MPN" label="MPN Panel" />
						<Tab value="TP53" label="TP53 Panel" />
						<Tab value="ABL1" label="ABL1 Panel" />
					</TabList>
				</AppBar>

				<TabPanel value="Myeloid">
					<FileList diseases={diseases} bed="Myeloid" merge={merge} />
					{merge ?
						<div className="row justify-content-center mt-3">
							<Button variant="contained" color="primary" onClick={() => handleClickMergeConfirm()}>
								合併
							</Button>
							<Button variant="contained" color="primary" className='ml-3' onClick={() => handleClickMerge()}>
								取消
							</Button>
						</div>
						:
						<div className="row justify-content-center mt-3"><Button variant="contained" color="primary" disabled={Myeloidfiles.length === 0 || Myeloidanalysis > 0} onClick={() => handleClick(Myeloidfiles, "Myeloid")}>
							開始分析
						</Button>
							<Button variant="contained" color="primary" className='ml-3' disabled={Myeloidfiles.length === 0 || Myeloidanalysis > 0} onClick={() => handleClickMerge()}>
								合併檔案
							</Button>
						</div>
					}
				</TabPanel>
				<TabPanel value="MPN">
					<FileList diseases={diseases} bed="MPN" merge={merge} />
					{merge ?
						<div className="row justify-content-center mt-3">
							<Button variant="contained" color="primary" onClick={() => handleClickMergeConfirm()}>
								合併
							</Button>
							<Button variant="contained" color="primary" className='ml-3' onClick={() => handleClickMerge()}>
								取消
							</Button>
						</div>
						:
						<div className="row justify-content-center mt-3"><Button variant="contained" color="primary" disabled={MPNfiles.length === 0 || MPNanalysis > 0} onClick={() => handleClick(MPNfiles, "MPN")}>
							開始分析
						</Button>
							<Button variant="contained" color="primary" className='ml-3' disabled={MPNfiles.length === 0 || MPNanalysis > 0} onClick={() => handleClickMerge()}>
								合併檔案
							</Button>
						</div>
					}

				</TabPanel>
				<TabPanel value="TP53">
					<FileList diseases={diseases} bed="TP53" merge={merge} />
					{merge ?
						<div className="row justify-content-center mt-3">
							<Button variant="contained" color="primary" onClick={() => handleClickMergeConfirm()}>
								合併
							</Button>
							<Button variant="contained" color="primary" className='ml-3' onClick={() => handleClickMerge()}>
								取消
							</Button>
						</div>
						:
						<div className="row justify-content-center mt-3"><Button variant="contained" color="primary" disabled={TP53files.length === 0 || TP53analysis > 0} onClick={() => handleClick(TP53files, "TP53")}>
							開始分析
						</Button>
							<Button variant="contained" color="primary" className='ml-3' disabled={TP53files.length === 0 || TP53analysis > 0} onClick={() => handleClickMerge()}>
								合併檔案
							</Button>
						</div>
					}
				</TabPanel>
				<TabPanel value="ABL1">
					<FileList diseases={diseases} bed="ABL1" merge={merge} />
					{merge ?
						<div className="row justify-content-center mt-3">
							<Button variant="contained" color="primary" onClick={() => handleClickMergeConfirm()}>
								合併
							</Button>
							<Button variant="contained" color="primary" className='ml-3' onClick={() => handleClickMerge()}>
								取消
							</Button>
						</div>
						:
						<div className="row justify-content-center mt-3"><Button variant="contained" color="primary" disabled={ABL1files.length === 0 || ABL1analysis > 0} onClick={() => handleClick(ABL1files, "ABL1")}>
							開始分析
						</Button>
							<Button variant="contained" color="primary" className='ml-3' disabled={TP53files.length === 0 || ABL1analysis > 0} onClick={() => handleClickMerge()}>
								合併檔案
							</Button>
						</div>
					}
				</TabPanel>
			</TabContext>


			<MergeFilesModal show={showModal} onClose={() => { setShowModal(false); setMerge(false); }} bed={value} ></MergeFilesModal>
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</React.Fragment>
	);
};
