import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import {
	AppBar,
	Button,
	Checkbox,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	FormControl,
	Grid,
	IconButton,
	InputBase,
	makeStyles,
	Paper,
	Select,
	Tab,
	Theme,
	Typography,
	useScrollTrigger,
	Zoom
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DeleteIcon from '@material-ui/icons/Delete';
import { Segment } from '../../models/segment.model';
import { Sample } from '../../models/sample.model';
import axios from 'axios';
import EditIcon from "@material-ui/icons/EditOutlined";
import KeyboardArrowUpIcon  from '@material-ui/icons/KeyboardArrowUp';
import DoneIcon from "@material-ui/icons/Done";
import AddIcon from '@material-ui/icons/Add';
import { ApiUrl } from '../../constants/constants';
import DescriptIcon from '@material-ui/icons/Description';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { SegmentTable } from '../table/SegmentTable';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { ExportModal } from '../modals/ExportModal';
import { UploadFolderModal } from '../modals/UploadFolderModal';
import { EditDiseaseModal } from '../modals/EditDiseaseModal';
import TabPanel from '@material-ui/lab/TabPanel';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import { Coverage } from '../../models/coverage.model';
import { MutationQC } from '../../models/mutationQC.model';
import { CoverageTable } from '../table/CoverageTable';
import { MutationQCCollapsibleTable } from '../table/MutationQCCollapsibleTable';
import { ResultContext } from '../../contexts/result.context';
import useCookies from 'react-cookie/cjs/useCookies';
import { AddSegmentTagModal } from '../modals/AddSegmentTagModal';
import { Run } from '../../models/run.model';
import { EditRunDateModal } from '../modals/EditRunDateModal';
import { AnalysisSummaryTable } from '../table/AnalysisSummaryTable';
import { Aligned } from '../../models/aligned.model';
declare module 'csstype' {
	interface Properties {
		'--tree-view-color'?: string;
		'--tree-view-bg-color'?: string;
	}
}

type StyledTreeItemProps = TreeItemProps & {
	bgColor?: string;
	color?: string;
	labelInfo?: string;
	labelText: string;
	handleSelectClick: (event: React.ChangeEvent, id: number, isSample: boolean) => void;
	isSample: boolean;
	isSelected?: boolean;
	rowCount: number;
	numSelected: number;
	labelInfoClickListener?;
};

const useTreeItemStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			color: theme.palette.text.secondary,
			userSelect: 'none',
			'&:hover > $content': {
				backgroundColor: theme.palette.action.hover
			},

			'&:focus > $content, &$selected > $content': {
				backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
				color: 'var(--tree-view-color)'
			},
			'&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
				backgroundColor: 'transparent'
			}
		},
		content: {
			color: theme.palette.text.secondary,
			borderTopRightRadius: theme.spacing(2),
			borderBottomRightRadius: theme.spacing(2),
			paddingRight: theme.spacing(1),
			fontWeight: theme.typography.fontWeightMedium,
			'$expanded > &': {
				fontWeight: theme.typography.fontWeightRegular
			}
		},
		group: {
			marginLeft: 0,
			'& $content': {
				paddingLeft: theme.spacing(2)
			}
		},
		expanded: {},
		selected: {},
		label: {
			fontWeight: 'inherit',
			color: 'inherit'
		},
		labelRoot: {
			display: 'flex',
			alignItems: 'center',
			padding: theme.spacing(0.5, 0)
		},
		labelIcon: {
			marginRight: theme.spacing(1)
		},
		labelText: {
			fontWeight: 'inherit',
			flexGrow: 1
		}
	})
);

  function StyledTreeItem(props: StyledTreeItemProps) {
	const classes = useTreeItemStyles();
	const { labelText, labelInfo, color, bgColor, nodeId, isSample, handleSelectClick, isSelected, rowCount, numSelected, labelInfoClickListener, ...other } = props;
  
	return (
	  <TreeItem
		label={
		  <div className={classes.labelRoot} onDoubleClick={labelInfoClickListener}>
			  <Checkbox 
			  	id = {nodeId}
				checked={isSelected}
				indeterminate={numSelected > 0 && numSelected < rowCount}
				onClick={e => (e.stopPropagation())}
				onChange={(event)=>handleSelectClick(event, parseInt(nodeId), isSample)}
				inputProps={{ 'aria-labelledby': nodeId }}
		  		/>
			<Typography variant="body2" className={classes.labelText}>
			  {labelText}
			</Typography>
			<Typography variant="caption" color="inherit">
			  {labelInfo}
			</Typography>
		  </div>

		}
		style={{
		  '--tree-view-color': color,
		  '--tree-view-bg-color': bgColor,
		}}
		classes={{
		  root: classes.root,
		  content: classes.content,
		  expanded: classes.expanded,
		  selected: classes.selected,
		  group: classes.group,
		  label: classes.label,
		}}
		nodeId={nodeId}
		{...other}
	  />
	);
  }

  const useStyles2 = makeStyles((theme) => ({
	root: {
	  position: 'fixed',
	  bottom: theme.spacing(2),
	  right: theme.spacing(2),
	},
  }));
  
  function ScrollTop(props) {
	const { children, window } = props;
	const classes = useStyles2();
	// Note that you normally won't need to set the window ref as useScrollTrigger
	// will default to window.
	// This is only being set here because the demo is in an iframe.
	const trigger = useScrollTrigger({
	  target: window ? window() : undefined,
	  disableHysteresis: true,
	  threshold: 100,
	});
  
	const handleClick = (event) => {
	  const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');
  
	  if (anchor) {
		anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
	  }
	};
  
	return (
	  <Zoom in={trigger}>
		<div onClick={handleClick} role="presentation" className={classes.root}>
		  {children}
		</div>
	  </Zoom>
	);
  }
  


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			maxHeight: '80vh',
			overflow: 'auto',
			flexGrow: 1
		},
		searchBar: {
			padding: '2px 4px',
			display: 'flex',
			alignItems: 'center',
			'& .Mui-focused': {
				color: 'green'
			}
		},
		input: {
			marginLeft: theme.spacing(1),
			flex: 1
		},
		formControl: {
			margin: theme.spacing(1),
			minWidth: 100
		},
		iconGroup: {
			width: 'fit-content',
			border: `1px solid ${theme.palette.divider}`,
			borderRadius: theme.shape.borderRadius,
			backgroundColor: theme.palette.background.paper,
			color: theme.palette.text.secondary,
			'& svg': {
				margin: theme.spacing(1.5)
			},
			'& hr': {
				margin: theme.spacing(0, 0.5)
			}
		}
	})
);
export const NgsResult: FunctionComponent = (prop) => {
	const classes = useStyles();
	const { sampleResults, segmentResults, coverageResults, mutationQCResults, alignedResults, setSamples } = useContext(ResultContext);
	const { blacklist, whitelist, filterlist, selectedTarget, selectedOther, setSelectedTarget, setSelectedOther, addBlacklist, addWhitelist } = useContext(SegmentTagContext);
	const [ targetSegments, setTargetSegments ] = useState(Array<Segment>());
	const [ otherSegments, setOtherSegments ] = useState(Array<Segment>());
	const [ selectedSegments, setSelectedSegments ] = useState<Array<Segment>>(new Array<Segment>());
	const [ selectedAddSegments, setSelectedAddSegments ] = useState<Array<Segment>>(new Array<Segment>());
	const [ selectedCoverages, setSelectedCoverages ] = useState<Array<Coverage>>(new Array<Coverage>());
	const [ selectedAligneds, setSelectedAligneds ] = useState<Array<Aligned>>(new Array<Aligned>());
	const [ selectedMutationQCs, setSelectedMutationQCs ] = useState<Array<MutationQC>>(new Array<MutationQC>());
	const [ selectedSample, setSelectedSample ] = useState<Sample>(new Sample());
	const [ selectedRun, setSelectedRun ] = useState<Run>(new Run());
	const [ showModal, setShowModal ] = useState<boolean>(false);
	const [ showUploadModal, setShowUploadModal ] = useState<boolean>(false);
	const [ showAddSegmentModal, setShowAddSegmentModal ] = useState<boolean>(false);
	const [ title, setTitle ] = useState<string>("blacklist");
	const [ showEditDiseaseModal, setShowEditDiseaseModal ] = useState<boolean>(false);
	const [ showEditRunDateModal, setShowEditRunDateModal ] = useState<boolean>(false);
	const [ showConfirmDialog, setShowConfirmDialog ] = useState<boolean>(false);
	const [ isEditable, setIsEditable ] = useState<boolean>(false);
	const [ isAdd, setIsAdd ] = useState<boolean>(false);
	const [ selected, setSelected ] = React.useState<number[]>([]);
	const [ selectedRunId, setSelectedRunId ] = React.useState<number[]>([]);
	const [ exportData, setExportData ] = useState<Segment[]>([]);
	const [ value, setValue ] = React.useState('1');
	const [ input, setInput ] = useState('');
	const [ cookies ] = useCookies();

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	useEffect(
		() => {
			setIsEditable(false);
			setIsAdd(false);
		},
		[ selectedSegments ]
	);

	useEffect(
		() => {
			/*if (selectedSegments.length>0){
				setSelectedSegments(segmentResults[selectedSegments[0].sample.sampleId])
			}*/
			const [ tempOther, tempTarget ] = filterSegments(selectedSegments);
			setOtherSegments(tempOther);
			setTargetSegments(tempTarget);
		},
		[ selectedSegments, blacklist, whitelist, isEditable ]
	);

	const handleUploadClick = () => {
		setShowUploadModal(true);
	};

	const handleSelectClick = (event: React.ChangeEvent, id: number, isSample: boolean) => {
		let newSelected: number[] = [];
		let newSelectedRunId: number[] = [];
		let runIsSelected: boolean = Boolean(1);

		if (isSample) {
			const selectedIndex = selected.indexOf(id);
			const runId = segmentResults[id][0].sample.run.runId;
			let ids: number[] = sampleResults[runId].map((sample) => sample.sampleId);
			ids.forEach((element) => {
				runIsSelected = runIsSelected && selected.indexOf(element as number) !== -1;
			});
			if (runIsSelected) {
				const selectedRunIdIndex = selectedRunId.indexOf(runId);
				if (selectedRunIdIndex === -1) {
					newSelectedRunId = newSelectedRunId.concat(selectedRunId, runId);
				} else if (selectedRunIdIndex === 0) {
					newSelectedRunId = newSelected.concat(selectedRunId.slice(1));
				} else if (selectedRunIdIndex === selectedRunId.length - 1) {
					newSelectedRunId = newSelectedRunId.concat(selectedRunId.slice(0, -1));
				} else if (selectedRunIdIndex > 0) {
					newSelectedRunId = newSelectedRunId.concat(
						selectedRunId.slice(0, selectedRunIdIndex),
						selectedRunId.slice(selectedRunIdIndex + 1)
					);
				}
				setSelectedRunId(newSelectedRunId);
			}
			
			if (selectedIndex === -1) {
				newSelected = newSelected.concat(selected, id);
			} else if (selectedIndex === 0) {
				newSelected = newSelected.concat(selected.slice(1));
			} else if (selectedIndex === selected.length - 1) {
				newSelected = newSelected.concat(selected.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
			}
		} else {
			let ids: number[] = sampleResults[id].map((sample) => sample.sampleId);
			ids.forEach((element) => {
				runIsSelected = runIsSelected && selected.indexOf(element as number) !== -1;
			});
			if (runIsSelected) {
				newSelected = selected.filter((id) => ids.indexOf(id) === -1);
			} else {
				newSelected = newSelected.concat(selected, ids.filter((id) => selected.indexOf(id) === -1));
			}
			const selectedIndex = selectedRunId.indexOf(id);
			if (selectedIndex === -1) {
				newSelectedRunId = newSelectedRunId.concat(selectedRunId, id);
			} else if (selectedIndex === 0) {
				newSelectedRunId = newSelected.concat(selectedRunId.slice(1));
			} else if (selectedIndex === selectedRunId.length - 1) {
				newSelectedRunId = newSelectedRunId.concat(selectedRunId.slice(0, -1));
			} else if (selectedIndex > 0) {
				newSelectedRunId = newSelectedRunId.concat(
					selectedRunId.slice(0, selectedIndex),
					selectedRunId.slice(selectedIndex + 1)
				);
			}
			setSelectedRunId(newSelectedRunId);
		}
		setSelected(newSelected);
	};
	const isSelected = (id: number | number[], isSample: boolean) => {
		if (isSample) {
			return selected.indexOf(id as number) !== -1;
		} else {
			let runIsSelected: boolean = Boolean(1);
			(id as number[]).forEach((element) => {
				runIsSelected = runIsSelected && selected.indexOf(element as number) !== -1;
			});

			return runIsSelected;
		}
	};
	
	const handleBlacklistAdd = async (segments: Segment[]) => {
		try {
			await axios.post(`${ApiUrl}/api/addBlacklist`, {
				data: segments
			});
		} catch (error) {
			console.log(error);
		} finally {
			addBlacklist(segments, cookies['user-name']);
			setSelectedTarget([]);
			setSelectedOther([]);
		}
	};
	const handleWhitelistAdd = async (segments: Segment[]) => {
		try {
			await axios.post(`${ApiUrl}/api/addWhitelist`, {
				data: segments
			});
		} catch (error) {
			console.log(error);
		} finally {
			addWhitelist(segments, cookies['user-name']);
			setSelectedTarget([]);
			setSelectedOther([]);
		}
	};
	function filterSegments(segments) {
		let tempOther = Array<Segment>();
		let tempTarget = Array<Segment>();
		if (segments) {
			segments.forEach((segment) => {
				if (
					filterlist.findIndex(
						(tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`
					) !== -1
				) {
					return;
				}
				if (
					blacklist.findIndex(
						(tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`
					) !== -1
				) {
					const finding = blacklist.find((tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)
					segment.remark = finding?.remark
					segment.editor = finding?.editor
					segment.clinicalSignificance = finding?.clinicalSignificance
					tempOther.push(segment);
				}
				else if (
					whitelist.findIndex(
						(tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`
					) !== -1
				) {
					const finding = whitelist.find((tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)
					segment.remark = finding?.remark
					segment.editor = finding?.editor
					segment.clinicalSignificance = finding?.clinicalSignificance
					tempTarget.push(segment);
				}
				else if(segment.clinicalSignificance?.indexOf("Pathogenic")!==-1){
					tempTarget.push(segment);
				}
				else if(segment.clinicalSignificance?.indexOf("Benign")!==-1){
					tempOther.push(segment);
				}
				else if(
				(segment.globalAF>0.01||segment.AFRAF>0.01||segment.AMRAF>0.01||segment.EURAF>0.01||segment.ASNAF>0.01)){
					tempOther.push(segment);
				}
				else if((
				segment.annotation.indexOf('stop') === -1 &&
				segment.annotation.indexOf('missense') === -1 &&
				segment.annotation.indexOf('frameshift') === -1 &&
				segment.annotation.indexOf('splice') === -1 &&
				segment.annotation.indexOf('inframe') === -1)){
					tempOther.push(segment);
				}else {
					tempTarget.push(segment);

				}
			});
		}

		return [ tempOther, tempTarget ];
	}
	const handleDoubleClick = (sample: Sample) => {
		setSelectedSample(sample);
		setShowEditDiseaseModal(true);
	};

	const handleRunDoubleClick = (run: Run) => {
		setSelectedRun(run);
		setShowEditRunDateModal(true);
	};

	const handleClick = (segments: Segment[], sample: Sample) => {
		setSelectedSegments(segments);
		setSelectedSample(sample)
		if (mutationQCResults[sample.sampleId]) setSelectedMutationQCs(mutationQCResults[sample.sampleId]);
		else setSelectedMutationQCs([]);
		if (coverageResults[sample.sampleId]) setSelectedCoverages(coverageResults[sample.sampleId]);
		else setSelectedCoverages([]);
		if (alignedResults[sample.sampleId]) setSelectedAligneds(alignedResults[sample.sampleId]);
		else setSelectedAligneds([]);
	};

	const handleBlacklistAddClick = () => {
		setSelectedAddSegments(selectedTarget.concat(selectedOther));
		setTitle("blacklist");
		setShowAddSegmentModal(true);
	};

	const handleWhitelistAddClick = () => {
		setSelectedAddSegments(selectedTarget.concat(selectedOther));
		setTitle("whitelist");
		setShowAddSegmentModal(true);
	};

	const handleExportClick = () => {
		setExportData(getExportData());
		setShowModal(true);
	};
	const handleDeleteClick = async () => {
		try {
			const response = await axios.post(`${ApiUrl}/api/deleteSamples`, {
				data: { sampleIds: selected, runIds: selectedRunId }
			});
			setSamples(response.data);
		} catch (error) {
			console.log(error);
		} finally {
			setShowConfirmDialog(false);
		}
	};

	const getExportData = () => {
		let newExportData: Segment[] = [];
		selected.forEach((id: number) => {
			let [ tempOther, tempTarget ] = filterSegments(segmentResults[id]);

			if (mutationQCResults[id]) {
				const fail = mutationQCResults[id]
					.filter((m: MutationQC) => m.QC < 50)
					.map((m: MutationQC) => m.geneName)
					.filter((element, index, arr) => arr.indexOf(element) === index);

				if (tempTarget[0]) {
					tempTarget[0].alert = 'Fail Gene Name: ' + fail.join('; ');
				} else {
					let alert = new Segment();
					alert.alert = 'Fail Gene Name: ' + fail.join('; ');
					tempTarget = [ alert ].concat(tempTarget);
				}
			}
			newExportData = newExportData.concat(tempTarget);
		});
		return newExportData;
	};

	const onToggleEditMode =  () => {
		if(isEditable){
			axios.post(`${ApiUrl}/api/updateSegment`, {
				data: segmentResults[selectedSample.sampleId] 
			});
			setSelectedSegments(segmentResults[selectedSample.sampleId])
		}
		setIsEditable(!isEditable);
	};
	

	const onToggleAddMode =  () => {
		setIsAdd(!isAdd);
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	const renderSampleButtons = () => {
        if(!isAdd && !isEditable){
			return (
				<>
					<Button
						aria-label="edit"
						onClick={onToggleEditMode}
						variant="contained"
						color="default"
						startIcon={<EditIcon />}
						className="mb-1"
					>
						Edit
					</Button>
					<Button
						aria-label="add"
						onClick={onToggleAddMode}
						variant="contained"
						color="default"
						startIcon={<AddIcon />}
						className="mb-1 mx-2"
					>
						Add to list
					</Button>
				</>
			)
		}
		else if (isAdd){
			return(
				<>
					<Button
						onClick={handleBlacklistAddClick}
						variant="contained"
						color="default"
						className="mb-1"
					>
						Add to blacklist
					</Button>
					<Button
						onClick={handleWhitelistAddClick}
						variant="contained"
						color="default"
						className="mb-1 mx-2"
					>
						Add to whitelist
					</Button>
					<Button
						onClick={onToggleAddMode}
						variant="contained"
						color="secondary"
						className="mb-1"
					>
						Back
					</Button>
				</>
			)
		}
		else if (isEditable){
			return (
				<>
					<Button
						onClick={onToggleEditMode}
						variant="contained"
						color="default"
						className="mb-1"
					>
						Save
					</Button>
				</>
			)
		}
    }

	return (
		<React.Fragment>
			<Title>Results Overview</Title>
			<div className="row">
				<div className="col-3">
					<Paper className={classes.searchBar}>
						<InputBase
							value={input}
							onChange={handleInputChange}
							className={classes.input}
							placeholder="Sample Name or Disease Name"
						/>
					</Paper>
					<Grid container alignItems="center" justify="center">							
						<Grid item xs={4}>
							<Button
								variant="contained"
								color="primary"
								startIcon={<ImportExportIcon />}
								onClick={handleExportClick}
							>
								匯出
							</Button>
						</Grid>
						<Grid item xs={4}>
							<Button
								variant="contained"
								color="primary"
								startIcon={<DescriptIcon />}
								onClick={handleUploadClick}
							>
								上傳
							</Button>
						</Grid>
						<Grid item xs={4}>
							<Button
								variant="contained"
								color="secondary"
								startIcon={<DeleteIcon />}
								onClick={() => setShowConfirmDialog(true)}
							>
								刪除
							</Button>
						</Grid>
					</Grid>
					<TreeView
						className={classes.root}
						defaultCollapseIcon={<ArrowDropDownIcon />}
						defaultExpandIcon={<ArrowRightIcon />}
						defaultEndIcon={<div style={{ width: 24 }} />}
					>
						{Object.keys(sampleResults).map((key) => (
							<StyledTreeItem
								nodeId={String(sampleResults[key][0].run.runId)}
								labelText={
									sampleResults[key][0].run.runName + '  (' + sampleResults[key].filter((sampleRow)=>sampleRow.disease.enName.indexOf(input)!==-1 || sampleRow.sampleName.split('_')[0].indexOf(input)!==-1).length + ' records)'
								}
								labelInfo={new Date(sampleResults[key][0].run.startTime).toLocaleDateString()}
								isSample={false}
								handleSelectClick={handleSelectClick}
								labelInfoClickListener={()=>handleRunDoubleClick(sampleResults[key][0].run)}
								isSelected={isSelected(sampleResults[key].map((sample) => sample.sampleId), false)}
								rowCount={sampleResults[key].length}
								numSelected={sampleResults[key].map((sample) => sample.sampleId).filter((s)=>selected.indexOf(s)===-1).length}
							>
								{sampleResults[key].map((sampleRow: Sample) => (
									sampleRow.disease.enName.indexOf(input)!==-1 || sampleRow.sampleName.split('_')[0].indexOf(input)!==-1?
									<StyledTreeItem
										nodeId={String(sampleRow.sampleId)}
										labelText={sampleRow.sampleName.split('_')[0] + '_' + sampleRow.disease.enName}
										onClick={() =>
											handleClick(segmentResults[sampleRow.sampleId], sampleRow)}
										isSample={true}
										onDoubleClick={() => handleDoubleClick(sampleRow)}
										handleSelectClick={handleSelectClick}
										isSelected={isSelected(sampleRow.sampleId, true)}
										rowCount={0}
										numSelected={0}
									/>:null
								))}
							</StyledTreeItem>
						))}
					</TreeView>
				</div>
				<div className="col-9" >
					<TabContext value={value}>
						<AppBar position="static" id="back-to-top-anchor">
							<TabList value={value} onChange={handleTabChange}>
								<Tab value="1" label="All Segments" />
								<Tab value="2" label="Sample Coverage" />
								<Tab value="3" label="Mutation QC" />
								<Tab value="4" label="Analysis Summary" />
							</TabList>
						</AppBar>
						<TabPanel value="1">
							{renderSampleButtons()}
							<SegmentTable
								data={targetSegments}
								setSelectSegments={(segments: Segment[])=>setSelectedTarget(segments)}
								title="targets"
								isEditMode={isEditable}
								isAddMode={isAdd}
							/>
							<SegmentTable
								data={otherSegments}
								setSelectSegments={(segments: Segment[])=>setSelectedOther(segments)}
								title="others"
								isEditMode={isEditable}
								isAddMode={isAdd}
							/>
							<AddSegmentTagModal show={showAddSegmentModal} title={title} onSave={title==="blacklist"?handleBlacklistAdd:handleWhitelistAdd} onClose={() => setShowAddSegmentModal(false)} segments={selectedAddSegments}></AddSegmentTagModal>
						</TabPanel>
						<TabPanel value="2">
							<CoverageTable data={selectedCoverages} title="Coverage" />
						</TabPanel>
						<TabPanel value="3">
							<MutationQCCollapsibleTable mutationQCs={selectedMutationQCs} />
						</TabPanel>
						<TabPanel value="4">
							<AnalysisSummaryTable data={selectedAligneds} title="Analysis Summary" />
						</TabPanel>
					</TabContext>
				</div>
			</div>
			<ScrollTop {...prop}>
				<Fab color="secondary" size="small" aria-label="scroll back to top">
					<KeyboardArrowUpIcon />
				</Fab>
			</ScrollTop>
			<ExportModal show={showModal} exportData={exportData} onClose={() => setShowModal(false)} />
			<UploadFolderModal show={showUploadModal} onClose={() => setShowUploadModal(false)} />
			<EditDiseaseModal
				show={showEditDiseaseModal}
				sample={selectedSample}
				onClose={() => setShowEditDiseaseModal(false)}
			/>
			<EditRunDateModal
				show={showEditRunDateModal}
				run={selectedRun}
				onClose={() => setShowEditRunDateModal(false)}
			/>
			<Dialog
				open={showConfirmDialog}
				onClose={() => setShowConfirmDialog(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">刪除資料</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">確認要刪除嗎？</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setShowConfirmDialog(false)} color="primary">
						取消
					</Button>
					<Button onClick={handleDeleteClick} color="primary" autoFocus>
						確認
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
};
