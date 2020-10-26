import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	TextField
} from '@material-ui/core';
import React, { FunctionComponent, useState, useContext, useEffect } from 'react';
import { ApiUrl } from '../../constants/constants';
import { Segment } from '../../models/segment.model';
import { SegmentTable } from '../table/SegmentTable';
import axios from 'axios';
import { SegmentTagContext } from '../../contexts/segmentTag.context';

type SampleModalProps = {
	show: boolean;
	segments: Segment[];
	sampleName: string;
	onClose: () => void;
};

export const SampleModal: FunctionComponent<SampleModalProps> = (props) => {
	const { blacklist, whitelist, addBlacklist, addWhitelist } = useContext(SegmentTagContext);
	const handleBlacklistAdd = (segments: Segment[]) => {
		addBlacklist(segments);
	};
	const handleWhitelistAdd = (segments: Segment[]) => {
		addWhitelist(segments)
	};
	const [targetSegments, setTargetSegments] = useState(Array<Segment>())
	const [otherSegments, setOtherSegments] = useState(Array<Segment>())
	useEffect(()=>{
		let tempOther = Array<Segment>();
		let tempTarget = Array<Segment>();
		props.segments.forEach((segment)=>{	
			if(blacklist.findIndex((tag)=>tag.id===`${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)!==-1){
				console.log(segment);
				tempOther.push(segment);
				return
			}
			if(whitelist.findIndex((tag)=>tag.id===`${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)!==-1){
				tempTarget.push(segment);
				return
			}
			if((segment.clinicalSignificance?.indexOf("Benign")!==-1&&segment.clinicalSignificance?.indexOf("Pathogenic ")===-1)||
			(segment.globalAF>0.01||segment.AFRAF>0.01||segment.AMRAF>0.01||segment.EURAF>0.01||segment.ASNAF>0.01)){
					tempOther.push(segment);
			}else{
					tempTarget.push(segment);
			}
		});
		console.log('blacklist',blacklist)
		console.log('whitelist',whitelist)
		setOtherSegments(tempOther);
		setTargetSegments(tempTarget);
	},[props.segments,blacklist,whitelist]);
	

	return (
		<Dialog maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Sample Name: {props.sampleName}</DialogTitle>
			<DialogContentText className="ml-5">
				Select the segments and	click Add Icon (+) to insert blacklist or whitelist.
			</DialogContentText>
			<DialogContent dividers>
				<SegmentTable data={targetSegments} title='targets' addUrl={`${ApiUrl}/api/addBlacklist`} handleAdd={handleBlacklistAdd} />
				<SegmentTable data={otherSegments} title='others' addUrl={`${ApiUrl}/api/addWhitelist`} handleAdd={handleWhitelistAdd} />
			</DialogContent>
			<DialogActions>
				<Button onClick={props.onClose} color="primary">
					匯出
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
