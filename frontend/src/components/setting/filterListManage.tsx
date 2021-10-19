import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import './Setting.css';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { SegmentTagTable } from '../table/SegmentTagTable';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import { SegmentTag } from '../../models/segmentTag.model';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { ApiUrl } from '../../constants/constants';
import axios from 'axios';
import { Button } from '@material-ui/core';
import EditIcon from "@material-ui/icons/EditOutlined";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import DoneIcon from "@material-ui/icons/Done";
import DescriptIcon from '@material-ui/icons/Description';
import { ExportDataToCsv } from '../../utils/exportDataToCsv';
import CSVReader from 'react-csv-reader';
import { UploadCSVModal } from '../modals/UploadCsvModal';
import { HotspotTable } from '../table/HotspotTable';


const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			padding: '2px 4px',
			display: 'flex',
			alignItems: 'center',
			width: 400,
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
			minWidth: 120
		}
	})
);
const prettyLink  = {
	color: '#fff'
  };

export const FilterListManage: FunctionComponent = (prop) => {
	const classes = useStyles();
	const now = new Date(Date.now())
	const [ condition, setCondition ] = useState('geneName');
	const [ input, setInput ] = useState('');
	const [ isEditable, setIsEditable ] = useState<boolean>(false);
	const { blacklist, whitelist, hotspotlist, deleteBlacklist, deleteWhitelist, deleteHotspotlist, setBlacklist, setWhitelist, setHotspotlist } = useContext(SegmentTagContext);
	const [ showBlacklist, setShowBlacklist ] = useState<SegmentTag[]>(blacklist);
	const [ showWhitelist, setShowWhitelist ] = useState<SegmentTag[]>(whitelist);
	const [ showHotspotlist, setShowHotspotlist ] = useState<SegmentTag[]>(hotspotlist);
	const [ showImportCSVModal, setShowImportCSVModal] = useState(false);

	useEffect(
		() => {
			setShowBlacklist(blacklist);
			setShowWhitelist(whitelist);
			setShowHotspotlist(hotspotlist);
		},
		[ blacklist, whitelist, hotspotlist ]
	);

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setCondition(event.target.value as string);
		setInput('');
	};

	const handleInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setInput(event.target.value as string);
	};

	const handleSearchClick = () => {
		if (hotspotlist.length > 0) setShowBlacklist(hotspotlist.filter((data) => data[condition].indexOf(input) !== -1));
		if (blacklist.length > 0) setShowBlacklist(blacklist.filter((data) => data[condition].indexOf(input) !== -1));
		if (whitelist.length > 0) setShowWhitelist(whitelist.filter((data) => data[condition].indexOf(input) !== -1));
	};

	const handleHotspotlistDelete = async (ids: string[]) => {
		try {
			await axios.post(`${ApiUrl}/api/deleteHotspotlist`, {
				data: showHotspotlist.filter((data) => ids.includes(data.id))
			});
		} catch (error) {
			console.log(error);
		} finally {
			setShowHotspotlist(showHotspotlist.filter((data) => !ids.includes(data.id)));
			deleteHotspotlist(ids);
		}
	};

	const handleBlacklistDelete = async (ids: string[]) => {
		try {
			await axios.post(`${ApiUrl}/api/deleteBlacklist`, {
				data: showBlacklist.filter((data) => ids.includes(data.id))
			});
		} catch (error) {
			console.log(error);
		} finally {
			setShowBlacklist(showBlacklist.filter((data) => !ids.includes(data.id)));
			deleteBlacklist(ids);
		}
	};

	const handleWhitelistDelete = async (ids: string[]) => {
		try {
			await axios.post(`${ApiUrl}/api/deleteWhitelist`, {
				data: showWhitelist.filter((data) => ids.includes(data.id))
			});
		} catch (error) {
			console.log(error);
		} finally {
			setShowWhitelist(showWhitelist.filter((data) => !ids.includes(data.id)));
			deleteWhitelist(ids);
		}
	};

	const onToggleEditMode =  () => {
		if(isEditable){
			axios.post(`${ApiUrl}/api/updateSegmentTag`, {
				data:  hotspotlist.concat(blacklist.concat(whitelist))
			});
		}
		setIsEditable(!isEditable)
		
	};

	const handleImportClick = (data)=>{
		console.log(data);
		axios.post(`${ApiUrl}/api/updateSegmentTag`, {
			data:  data
		}).then(()=>{
			window.location.reload();
		})

	};

	return (
		<React.Fragment>
			<div className="row ml-3 mt-3">	
				<Button
					variant="contained"
					color="primary"
					startIcon={<ImportExportIcon />}
					className={"mx-2"}
				>
					<ExportDataToCsv fileName={`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}-${now.getHours()}_filterlist.csv`} data={hotspotlist.concat(blacklist.concat(whitelist))} style={prettyLink}>
                    	匯出
                	</ExportDataToCsv>
				</Button>

				<Button
					variant="contained"
					color="primary"
					startIcon={<DescriptIcon />}
					className={"mx-2"}
					onClick={()=>setShowImportCSVModal(true)}
				>
					上傳
				</Button>
				{isEditable ? (
					<Button
						onClick={onToggleEditMode}
						aria-label="done"
						variant="contained"
						color="default"
						startIcon={<DoneIcon />}
						className="mb-1"
					>
						儲存
					</Button>
				) : (
					<Button
						aria-label="edit"
						onClick={onToggleEditMode}
						variant="contained"
						color="default"
						startIcon={<EditIcon />}
						className="mb-1"
					>
						編輯
					</Button>
				)}
				
			</div>
			<div className="row ml-3 mt-3">
				<FormControl variant="outlined" className={classes.formControl}>
					<Select native value={condition} onChange={handleChange}>
						<option value="geneName">Gene Name</option>
						<option value="HGVSc">HGVSc</option>
						<option value="HGVSp">HGVSp</option>
					</Select>
				</FormControl>
				<Paper className={classes.root}>
					<InputBase
						value={input}
						onChange={handleInputChange}
						className={classes.input}
						placeholder="Search Hotspotlist, Blacklist, and Whitelist"
					/>
					<IconButton type="submit" aria-label="search" onClick={handleSearchClick}>
						<SearchIcon />
					</IconButton>
				</Paper>
			</div>
			<div className="row justify-content-center mt-3 px-4">
				<HotspotTable
					data={showHotspotlist}
					title="Hotspot"
					handleChange={setHotspotlist}
					handleDelete={handleHotspotlistDelete}
					isEditMode={isEditable}
				/>
			</div>
			<div className="row justify-content-center mt-3 px-4">
				<SegmentTagTable
					data={showBlacklist}
					title="Blacklist"
					handleChange={setBlacklist}
					handleDelete={handleBlacklistDelete}
					isEditMode={isEditable}
				/>
			</div>
			<div className="row justify-content-center mt-3 px-4">
				<SegmentTagTable
					data={showWhitelist}
					title="Whitelist"
					handleChange={setWhitelist}
					handleDelete={handleWhitelistDelete}
					isEditMode={isEditable}
				/>
			</div>
			<UploadCSVModal handleImportClick={handleImportClick} show={showImportCSVModal} onClose={() => setShowImportCSVModal(false)} />
		</React.Fragment>
	);
};
