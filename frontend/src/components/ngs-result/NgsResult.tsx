import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Title } from '../title/Title';
import {
	AppBar,
	Button,
	Checkbox,
	createStyles,
	Divider,
	FormControl,
	Grid,
	IconButton,
	InputBase,
	InputLabel,
	makeStyles,
	MenuItem,
	Paper,
	Select,
	Tab,
	Tabs,
	TextField,
	Theme,
	Typography
} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem, { TreeItemProps } from '@material-ui/lab/TreeItem';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { Segment } from '../../models/segment.model';
import { Sample } from '../../models/sample.model';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import DescriptIcon from '@material-ui/icons/Description';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { SvgIconProps } from '@material-ui/core/SvgIcon';
import { SegmentTable } from '../table/SegmentTable';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { ExportDataToCsv } from '../../utils/exportDataToCsv';
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
	handleSelectClick:(event:React.MouseEvent<unknown>, id:number)=> void;
	isSample: boolean;
	isSelected?: boolean;
  };
  
  const useTreeItemStyles = makeStyles((theme: Theme) =>
	createStyles({
	  root: {
		color: theme.palette.text.secondary,
		'&:hover > $content': {
		  backgroundColor: theme.palette.action.hover,
		},

		'&:focus > $content, &$selected > $content': {
		  backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
		  color: 'var(--tree-view-color)',
		},
		'&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
		  backgroundColor: 'transparent',
		},
	  },
	  content: {
		color: theme.palette.text.secondary,
		borderTopRightRadius: theme.spacing(2),
		borderBottomRightRadius: theme.spacing(2),
		paddingRight: theme.spacing(1),
		fontWeight: theme.typography.fontWeightMedium,
		'$expanded > &': {
		  fontWeight: theme.typography.fontWeightRegular,
		},
	  },
	  group: {
		marginLeft: 0,
		'& $content': {
		  paddingLeft: theme.spacing(2),
		},
	  },
	  expanded: {},
	  selected: {},
	  label: {
		fontWeight: 'inherit',
		color: 'inherit',
	  },
	  labelRoot: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0.5, 0),
	  },
	  labelIcon: {
		marginRight: theme.spacing(1),
	  },
	  labelText: {
		fontWeight: 'inherit',
		flexGrow: 1,
	  },
	}),
  );
  
  function StyledTreeItem(props: StyledTreeItemProps) {
	const classes = useTreeItemStyles();
	const { labelText, labelInfo, color, bgColor, nodeId, isSample, handleSelectClick, isSelected, ...other } = props;
  
	return (
	  <TreeItem
		label={
		  <div className={classes.labelRoot}>
			  { isSample?
				  <Checkbox 
				  	checked={isSelected}
				  	onClick={(event)=>handleSelectClick(event, parseInt(nodeId))}
			  		inputProps={{ 'aria-labelledby': nodeId }}
				/>:null
			  }
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

  const useStyles = makeStyles((theme: Theme)=>
	createStyles({
	  root: {
		maxHeight:'80vh',
		overflow: 'auto',
		flexGrow: 1
	  },		
	  input: {
		marginLeft: theme.spacing(1),
		flex: 1
	},
	formControl: {
		margin: theme.spacing(1),
		minWidth: 200
	},
	iconGroup: {
		width: 'fit-content',
		border: `1px solid ${theme.palette.divider}`,
		borderRadius: theme.shape.borderRadius,
		backgroundColor: theme.palette.background.paper,
		color: theme.palette.text.secondary,
		'& svg': {
		  margin: theme.spacing(1.5),
		},
		'& hr': {
		  margin: theme.spacing(0, 0.5),
		},
	  },
	}),
  );
export const NgsResult: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ samples, setSamples ] = useState(Array<Sample>());
	const [ segments, setSegments ] = useState(Array<Segment>());
	const [ coverages, setCoverages ] = useState(Array<Coverage>());
	const [ mutationQCs, setMutationQCs ] = useState(Array<MutationQC>());
	const { blacklist, whitelist, filterlist, addBlacklist, addWhitelist } = useContext(SegmentTagContext);
	const [targetSegments, setTargetSegments] = useState(Array<Segment>())
	const [otherSegments, setOtherSegments] = useState(Array<Segment>())
	const [ selectedSegments, setSelectedSegments] = useState<Array<Segment>>(new Array<Segment>());
	const [ selectedCoverages, setSelectedCoverages] = useState<Array<Coverage>>(new Array<Coverage>());
	const [ selectedMutationQCs, setSelectedMutationQCs] = useState<Array<MutationQC>>(new Array<MutationQC>());
	const [ selectedSample, setSelectedSample] = useState<Sample>(new Sample());
	const [ showModal, setShowModal ] = useState<boolean>(false);
	const [ showUploadModal, setShowUploadModal ] = useState<boolean>(false);
	const [ showEditDiseaseModal, setShowEditDiseaseModal ] = useState<boolean>(false);
	const [ selected, setSelected ] = React.useState<number[]>([]);
	const [value, setValue] = React.useState('1');

	const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
		setValue(newValue);
	};
	useEffect(() => {
		const getAllSamples = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/samples`);
				setSamples(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllSegments = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/segments`);
				setSegments(response.data);
			} catch (error) {
				console.log(error);
			}
		};

		const getAllCoverages = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/coverages`);
				setCoverages(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		const getAllMutationQCs = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/mutationQCs`);
				setMutationQCs(response.data);
			} catch (error) {
				console.log(error);
			}
		};
		getAllSamples();
		getAllSegments();
		getAllCoverages();
		getAllMutationQCs();
	}, []);

	useEffect(()=>{
		const [tempOther, tempTarget] =filterSegments(selectedSegments);
		setOtherSegments(tempOther);
		setTargetSegments(tempTarget);
	},[selectedSegments,blacklist,whitelist]);



	const handleUploadClick = ()=>{
		setShowUploadModal(true)
	}

	const handleSelectClick = (event: React.MouseEvent<unknown>, id: number) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected: number[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	};
	const isSelected = (id: number) => selected.indexOf(id) !== -1;

	const testsamples=samples.reduce((groups, item) => {
		const val = `${item.run.runId}_${item.run.runName}`;
		groups[val] = groups[val] || [];
		groups[val].push(item);
		return groups;
	}, {})
	
	const testsegments=segments.reduce((groups, item) => {
		const val = item.sample.sampleId;
		groups[val] = groups[val] || [];
		groups[val].push(item);
		return groups;
	}, {})

	const testcoverages=coverages.reduce((groups, item) => {
		const val = item.sample.sampleId;
		groups[val] = groups[val] || [];
		groups[val].push(item);
		return groups;
	}, {})
	const testmutationqcs=mutationQCs.reduce((groups, item) => {
		const val = item.sample.sampleId;
		groups[val] = groups[val] || [];
		groups[val].push(item);
		return groups;
	}, {})
	
	const handleBlacklistAdd = (segments: Segment[]) => {
		addBlacklist(segments);
	};
	const handleWhitelistAdd = (segments: Segment[]) => {
		addWhitelist(segments)
		
	};
	function filterSegments(segments){
		
		let tempOther = Array<Segment>();
		let tempTarget = Array<Segment>();
	
		segments.forEach((segment)=>{	
			if(filterlist.findIndex((tag)=>tag.id===`${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)!==-1){
				return
			}
			if(blacklist.findIndex((tag)=>tag.id===`${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)!==-1){
				tempOther.push(segment);
				return
			}
			if(whitelist.findIndex((tag)=>tag.id===`${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)!==-1){
				tempTarget.push(segment);
				return
			}
			if((segment.clinicalSignificance?.indexOf("Benign")!==-1)||(
			segment.annotation.indexOf('stop') === -1 &&
			segment.annotation.indexOf('missense') === -1 &&
			segment.annotation.indexOf('frameshift') === -1 &&
			segment.annotation.indexOf('splice') === -1)||
			(segment.globalAF>0.01||segment.AFRAF>0.01||segment.AMRAF>0.01||segment.EURAF>0.01||segment.ASNAF>0.01)){
					tempOther.push(segment);
			}else{
					tempTarget.push(segment);
			}
		});

		return [tempOther, tempTarget];
		
	}
	const handleDoubleClick = (sample:Sample) => {
		setSelectedSample(sample);
		setShowEditDiseaseModal(true);
	}
	const handleClick = (segments:Segment[], sampleId: number) => {
		setSelectedSegments(segments)
		if(testmutationqcs[sampleId])
			setSelectedMutationQCs(testmutationqcs[sampleId])
		else
			setSelectedMutationQCs([])
		setSelectedCoverages(testcoverages[sampleId])
	};
	const handleExportClick = () =>{
		setShowModal(true)
	}

	const exportData = () =>{
		let exportData: Segment[] = []
		selected.forEach((id:number)=>{
			let alert = ""
			if (testmutationqcs[id]){
				const fail = testmutationqcs[id].filter((m:MutationQC)=>m.QC<100).map((m:MutationQC)=>m.geneName + "("+m.cosmic+")").filter((element, index, arr) => arr.indexOf(element) === index)
				alert = "Fail Gene Name: " + fail.join(' ,')
			}
			const [tempOther, tempTarget] =filterSegments(testsegments[id]);
			tempTarget[0].alert = alert
			exportData = exportData.concat(tempTarget);
		});
		return exportData;
	};
	return (
		<React.Fragment>
			<Title>Results Overview</Title>
		<div className="row">
			<div className="col-3">
				<Grid container alignItems="center" justify="center">
					<Grid item xs={5}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<ImportExportIcon />}
							onClick={handleExportClick}
						>
							匯出
						</Button>
					</Grid>
					<Grid item xs={5}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<DescriptIcon />}
							onClick={handleUploadClick}
						>
						上傳
						</Button>
	  				</Grid>		
				</Grid>
				<TreeView
					className={classes.root}
					defaultCollapseIcon={<ArrowDropDownIcon />}
					defaultExpandIcon={<ArrowRightIcon />}
					defaultEndIcon={<div style={{ width: 24 }} />}
				>
					{
						Object.keys(testsamples).map((key) => (
							<StyledTreeItem 
								nodeId={String(testsamples[key][0].run.runId)} 
								labelText={testsamples[key][0].run.runName + "  ("+testsamples[key].length + " records)"} 
								isSample={false}
								handleSelectClick={handleSelectClick}>
								{
									testsamples[key].map((sampleRow: Sample)=>
										<StyledTreeItem 
											nodeId={String(sampleRow.sampleId)} 
											labelText={sampleRow.sampleName.split('_')[0]+"_"+sampleRow.disease.enName} 
											onClick={()=>handleClick(testsegments[sampleRow.sampleId], sampleRow.sampleId)} 
											isSample={true} 
											onDoubleClick={()=>handleDoubleClick(sampleRow)}
											handleSelectClick={handleSelectClick}
											isSelected={isSelected(sampleRow.sampleId)}
										/>)
								}
							</StyledTreeItem>
						))
					}
					
				</TreeView>
			</div>
			<div className="col-9">
				<TabContext value={value}>
					<AppBar position="static" >
						<TabList 
							value={value}
							onChange={handleTabChange}>
							<Tab value="1" label="All Segments"/>
							<Tab value="2" label="Sample Coverage"/>
							<Tab value="3" label="Mutation QC"/>

						</TabList >
					</AppBar>
					<TabPanel value="1">
						<SegmentTable data={targetSegments} title='targets' addUrl={`${ApiUrl}/api/addBlacklist`} handleAdd={handleBlacklistAdd} />
						<SegmentTable data={otherSegments} title='others' addUrl={`${ApiUrl}/api/addWhitelist`} handleAdd={handleWhitelistAdd} />
					</TabPanel>
					<TabPanel value="2">
						<CoverageTable data={selectedCoverages} title='Coverage' />
					</TabPanel>
					<TabPanel value="3">
						<MutationQCCollapsibleTable mutationQCs={selectedMutationQCs} />
					</TabPanel>
				</TabContext>
			</div>
		</div>
		<ExportModal show={showModal} exportData={exportData()} onClose={()=>setShowModal(false) }></ExportModal>
		<UploadFolderModal show={showUploadModal} onClose={()=>setShowUploadModal(false)} />
		<EditDiseaseModal show={showEditDiseaseModal} sample={selectedSample} onClose={()=>setShowEditDiseaseModal(false)}/>
	  </React.Fragment>
	);

};
