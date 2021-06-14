import { Segment } from '../models/segment.model';
import { SegmentTag } from '../models/segmentTag.model';

export const SegmentTagReducer = (state, action) => {

	switch (action.type) {
		case 'SETBLACKLIST':
			return {
				...state,
				blacklist: action.payload
			};
		case 'SETWHITELIST':
			return {
				...state,
				whitelist: action.payload
			};
		case 'SETFILTERLIST':
			return {
				...state,
				filterlist: action.payload
			};
		case 'SETHOTSPOTLIST':
			return {
				...state,
				hotspotlist: action.payload
			};
		case 'SETSELECTEDTARGET':
			return {
				...state,
				selectedTarget: action.payload
			};
		case 'SETSELECTEDOTHER':
			return {
				...state,
				selectedOther: action.payload
			};
		case 'DELETEBLACKLIST':
			const deleteBlackIds = action.payload as string[];
			const deletedBlacklist = state.blacklist.filter((data) => !deleteBlackIds.includes(data.id));
			return {
				...state,
				blacklist: deletedBlacklist
			};
		case 'DELETEWHITELIST':
			const deleteWhiteIds = action.payload as string[];
			const deletedWhitelist = state.whitelist.filter((data) => !deleteWhiteIds.includes(data.id));

			return {
				...state,
				whitelist: deletedWhitelist
			};
		case 'DELETEHOTSPOTLIST':
			const deleteHotspotIds = action.payload as string[];
			const deletedHotspotlist = state.hotspotlist.filter((data) => !deleteHotspotIds.includes(data.id));

			return {
				...state,
				hotspotlist: deletedHotspotlist
			};
		case 'ADDBLACKLIST':
			const addBlackSegments = action.payload as {segmentTags: Segment[], userName: string};
			let blackIds = new Array<string>();
			const addBlackSegmentTags = addBlackSegments['segmentTags'].map((segmentTag) => {
				let temp = new SegmentTag();
				temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
				blackIds.push(temp.id);
				temp.chr = segmentTag.chr;
				temp.position = segmentTag.position;
				temp.HGVSc = segmentTag.HGVSc;
				temp.HGVSp = segmentTag.HGVSp;
				temp.clinicalSignificance = segmentTag.clinicalSignificance;
				temp.geneName = segmentTag.geneName;
				temp.editor = addBlackSegments['userName'];
				temp.remark = segmentTag.remark;
                temp.category = 'blacklist'
				return temp;
            });
			const newWhitelist = state.whitelist.filter((segmentTag) => !blackIds.includes(segmentTag.id));

			return {
				...state,
				blacklist: state.blacklist.concat(addBlackSegmentTags),
				whitelist: newWhitelist
			};
		case 'ADDWHITELIST':
			const addWhiteSegments = action.payload as {segmentTags: Segment[], userName: string};
			let whiteIds = new Array<string>();
			const addWhiteSegmentTags = addWhiteSegments['segmentTags'].map((segmentTag) => {
				let temp = new SegmentTag();
				temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
				whiteIds.push(temp.id);
				temp.chr = segmentTag.chr;
				temp.position = segmentTag.position;
				temp.HGVSc = segmentTag.HGVSc;
				temp.HGVSp = segmentTag.HGVSp;
				temp.geneName = segmentTag.geneName;
				temp.clinicalSignificance = segmentTag.clinicalSignificance;
				temp.editor = addWhiteSegments['userName'];
				temp.remark = segmentTag.remark;
                temp.category = 'whitelist'
				return temp;
            });
			const newBlacklist = state.blacklist.filter((segmentTag) => !whiteIds.includes(segmentTag.id));

			return {
				...state,
				blacklist: newBlacklist,
				whitelist: state.whitelist.concat(addWhiteSegmentTags)
			};
		
		default:
			return state;
	}
};
