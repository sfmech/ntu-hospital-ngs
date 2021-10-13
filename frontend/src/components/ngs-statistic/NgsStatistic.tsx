import { Button, createStyles, makeStyles, Paper, TextField, Theme, Typography } from '@material-ui/core';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { ResultContext } from '../../contexts/result.context';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { Segment } from '../../models/segment.model';
import { StatisticGeneNameData } from '../../models/statistic.geneName.model';
import { StatistcGeneNameTable } from '../table/StatisticGeneNameTable';
import { Title } from '../title/Title';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400,
			
		},
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		  },
		  textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		  },
    })
);


export const NgsStatistic: FunctionComponent = (prop) => {
	const classes = useStyles();
    const { segmentResults} = useContext(ResultContext);
    const { blacklist, whitelist, filterlist, hotspotlist } = useContext(SegmentTagContext);
	const now = new Date(Date.now());
	const [selectedStartDate, setSelectedStartDate] = React.useState(`${now.getFullYear()-3}-${(now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);
	const [selectedEndDate, setSelectedEndDate] = React.useState(`${now.getFullYear()}-${(now.getMonth() > 8) ? (now.getMonth() + 1) : ('0' + (now.getMonth() + 1))}-${(now.getDate() > 9) ? now.getDate() : ('0' + now.getDate())}`);
    const [ selectSegments, setSelectSegments ] = useState(Array<Segment>());
	const [ targetSegments, setTargetSegments ] = useState(Array<Segment>());
    const [ otherSegments, setOtherSegments ] = useState(Array<Segment>());

    const [ statisticGeneNameData, setStatisticGeneNameData] = useState(Array<StatisticGeneNameData>());
    
    useEffect(()=>{
        let tempAllTarget: Segment[] = []
        let tempAllOther: Segment[] = []
        Object.keys(segmentResults).forEach(sampleId => {
            let [tempOtherSegment, tempTargetSegment] = filterSegments(segmentResults[sampleId]);

            tempAllTarget = tempAllTarget.concat(tempTargetSegment);
            tempAllOther = tempAllOther.concat(tempOtherSegment);
        });
        setTargetSegments(tempAllTarget);
        setOtherSegments(tempAllOther);
    },[segmentResults, blacklist, whitelist, filterlist]);

    useEffect(()=>{
        let allGeneNames: string[] = []
        const targetGroupByGeneName = targetSegments.reduce((groups, item) => {
            const val = item.geneName;
            if (allGeneNames.indexOf(val)===-1)
                allGeneNames.push(val);
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});

        const otherGroupByGeneName = otherSegments.reduce((groups, item) => {
            const val = item.geneName;
            if (allGeneNames.indexOf(val)===-1)
                allGeneNames.push(val);
            groups[val] = groups[val] || [];
            groups[val].push(item);
            return groups;
        }, {});
        
        setStatisticGeneNameData(allGeneNames.map((geneName)=>{
            let data = new StatisticGeneNameData();
            data.geneName = geneName;
            data.targetCount = targetGroupByGeneName[geneName]?targetGroupByGeneName[geneName].length : 0;
            data.otherCount = otherGroupByGeneName[geneName]?otherGroupByGeneName[geneName].length : 0;
            data.total = data.targetCount + data.otherCount;
            return data;
        }))
    },[ targetSegments, otherSegments])
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
					hotspotlist.findIndex(
						(tag) => segment.HGVSp.indexOf(tag.HGVSp) !==-1 && segment.geneName === tag.geneName
					) !== -1
				) {
					const finding = hotspotlist.find((tag) => segment.HGVSp.indexOf(tag.HGVSp) !==-1 && segment.geneName === tag.geneName)
					segment.clinicalSignificance = finding?.clinicalSignificance;
					segment.remark = finding?.remark;
					segment.editor = finding?.editor;
					if (segment.category==="Target"){
						tempTarget.push(segment);
					}else if (segment.category==="Other"){
						tempOther.push(segment);
					}else{
						segment.category="Target";
						tempTarget.push(segment);
					}
					
					
				}
				else if (
					blacklist.findIndex(
						(tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`
					) !== -1
				) {
					const finding = blacklist.find((tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)
					segment.remark = finding?.remark;
					segment.editor = finding?.editor;
					segment.clinicalSignificance = finding?.clinicalSignificance;
					if (segment.category==="Target"){
						tempTarget.push(segment);
					}else if (segment.category==="Other"){
						tempOther.push(segment);
					}else{
						segment.category="Other";
						tempOther.push(segment);
					}
					
				}
				else if (
					whitelist.findIndex(
						(tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`
					) !== -1
				) {
					const finding = whitelist.find((tag) => tag.id === `${segment.chr}_${segment.position}_${segment.HGVSc}_${segment.HGVSp}`)
					segment.remark = finding?.remark;
					segment.editor = finding?.editor;
					segment.clinicalSignificance = finding?.clinicalSignificance;
					if (segment.category==="Target"){
						tempTarget.push(segment);
					}else if (segment.category==="Other"){
						tempOther.push(segment);
					}else{
						segment.category="Target";
						tempTarget.push(segment);
					}
					
				}else if (segment.category==="Target"){
					tempTarget.push(segment);
				}else if (segment.category==="Other"){
					tempOther.push(segment);
				}
			});
		}

		return [ tempOther, tempTarget ];
	}
    
	const handleDateStartChange = (event: React.ChangeEvent<{ value: unknown }>) => {	
		setSelectedStartDate(event.target.value as string);
  };
  	const handleEndDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {	
		setSelectedEndDate(event.target.value as string);
	};

	const handleOnClick=()=>{
		if(new Date(selectedEndDate) >= new Date(selectedStartDate)){
			let tempAllTarget: Segment[] = []
			let tempAllOther: Segment[] = []
			Object.keys(segmentResults).forEach(sampleId => {
				if(new Date(segmentResults[sampleId][0].sample.run.startTime) >= new Date(selectedStartDate) && 
				new Date(segmentResults[sampleId][0].sample.run.startTime) < new Date(selectedEndDate)){
					let [tempOtherSegment, tempTargetSegment] = filterSegments(segmentResults[sampleId]);

					tempAllTarget = tempAllTarget.concat(tempTargetSegment);
					tempAllOther = tempAllOther.concat(tempOtherSegment);
				}
			});
			setTargetSegments(tempAllTarget);
			setOtherSegments(tempAllOther);
		}
	};
	return (
		<React.Fragment>
			<Title>Statistic System</Title>
			<Paper className="my-3">
			<form className={classes.container} noValidate>
				<TextField
							id="startdate"
							label="start date"
							type="date"
							defaultValue={selectedStartDate}
							onChange={handleDateStartChange}
							className={classes.textField+" my-3 ml-3"}
							InputLabelProps={{
							shrink: true,
							}}
				/> 
				<Typography variant="h5" display="inline" style={{lineHeight:"80px"}}>~</Typography>
				<TextField
							id="enddate"
							label="end date"
							type="date"
							defaultValue={selectedEndDate}
							onChange={handleEndDateChange}
							className={classes.textField+" my-3"}
							InputLabelProps={{
							shrink: true,
							}}
				/>
				<Button
					variant="contained"
					color="primary"
					className={"mx-2 my-3"}
					onClick={handleOnClick}
					style={{height:40}}
				>
					搜尋
				</Button>
			</form>
			
			</Paper>

            <StatistcGeneNameTable data={statisticGeneNameData} title="Gene Name" />
		</React.Fragment>
	);
};
