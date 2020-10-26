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
		case 'DELETEBLACKLIST':
			const deleteBlackIds = action.payload as string[];
			const deletedBlacklist = state.blacklist.filter((data) => !deleteBlackIds.includes(data.id));
			return {
				...state,
				blacklist: deletedBlacklist
			};
		case 'DELETEBLACKLIST':
			const deleteWhiteIds = action.payload as string[];
			const deletedWhitelist = state.whitelist.filter((data) => !deleteWhiteIds.includes(data.id));

			return {
				...state,
				whitelist: deletedWhitelist
			};
		case 'ADDBLACKLIST':
			const addBlackSegments = action.payload as Segment[];
			let blackIds = new Array<string>();
			const addBlackSegmentTags = addBlackSegments.map((segmentTag) => {
				let temp = new SegmentTag();
				temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
				blackIds.push(temp.id);
				temp.chr = segmentTag.chr;
				temp.position = segmentTag.position;
				temp.HGVSc = segmentTag.HGVSc;
                temp.HGVSp = segmentTag.HGVSp;
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
			const addWhiteSegments = action.payload as Segment[];
			let whiteIds = new Array<string>();
			const addWhiteSegmentTags = addWhiteSegments.map((segmentTag) => {
				let temp = new SegmentTag();
				temp.id = `${segmentTag.chr}_${segmentTag.position}_${segmentTag.HGVSc}_${segmentTag.HGVSp}`;
				whiteIds.push(temp.id);
				temp.chr = segmentTag.chr;
				temp.position = segmentTag.position;
				temp.HGVSc = segmentTag.HGVSc;
                temp.HGVSp = segmentTag.HGVSp;
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
