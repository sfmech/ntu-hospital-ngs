import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { ResultContext } from '../../contexts/result.context';
import { SegmentTagContext } from '../../contexts/segmentTag.context';
import { Segment } from '../../models/segment.model';
import { StatisticGeneNameData } from '../../models/statistic.geneName.model';
import { StatistcGeneNameTable } from '../table/StatisticGeneNameTable';
import { Title } from '../title/Title';


export const NgsStatistic: FunctionComponent = (prop) => {
    const { segmentResults} = useContext(ResultContext);
    const { blacklist, whitelist, filterlist } = useContext(SegmentTagContext);

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
    
	return (
		<React.Fragment>
			<Title>Statistic System</Title>
            <StatistcGeneNameTable data={statisticGeneNameData} title="Gene Name" />
		</React.Fragment>
	);
};
