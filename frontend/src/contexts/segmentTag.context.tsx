import React, { createContext, useReducer, useEffect } from 'react';
import { SegmentTagReducer } from './segmentTag.reducer';
import { SegmentTag } from '../models/segmentTag.model';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { Segment } from '../models/segment.model';

const initialState = {
	blacklist: new Array<SegmentTag>(),
	whitelist: new Array<SegmentTag>(),
	filterlist: new Array<SegmentTag>(),
	setBlacklist: (blacklist: SegmentTag[]) => {},
	setWhitelist: (whitelist: SegmentTag[]) => {},
	setFilterlist: (filterlist: SegmentTag[]) => {},
	deleteBlacklist: (ids: string[]) => {},
	deleteWhitelist: (ids: string[]) => {},
	addBlacklist: (segmentTags: Segment[], userName: string) => {},
	addWhitelist: (segmentTags: Segment[], userName: string) => {}
};

export const SegmentTagContext = createContext(initialState);

export const SegmentTagProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(SegmentTagReducer, initialState);

	useEffect(() => {
		const getFilterlist = async () => {
			try {
				const response = await axios(`${ApiUrl}/api/segmentTags`);
				if (response.data.length > 0) {
					const groupByCategory = response.data.reduce((groups, item) => {
						const val = item.category;
						groups[val] = groups[val] || [];
						groups[val].push(item);
						return groups;
                    }, {});
                    if(groupByCategory.blacklist)
                        setBlacklist(groupByCategory.blacklist);
                    if(groupByCategory.whitelist)
						setWhitelist(groupByCategory.whitelist);
					if(groupByCategory.filterlist)
						setFilterlist(groupByCategory.filterlist);
				}
			} catch (error) {
				console.log(error);
			}
		};
		getFilterlist();
	}, []);

	function setBlacklist(blacklist: SegmentTag[]) {
		dispatch({
			type: 'SETBLACKLIST',
			payload: blacklist
		});
	}

	function setWhitelist(whitelist: SegmentTag[]) {
		dispatch({
			type: 'SETWHITELIST',
			payload: whitelist
		});
	}

	function setFilterlist(filterlist: SegmentTag[]) {
		dispatch({
			type: 'SETFILTERLIST',
			payload: filterlist
		});
	}

	function deleteBlacklist(ids: string[]) {
		dispatch({
			type: 'DELETEBLACKLIST',
			payload: ids
		});
	}

	function deleteWhitelist(ids: string[]) {
		dispatch({
			type: 'DELETEWHITELIST',
			payload: ids
		});
	}

	function addBlacklist(segmentTags: Segment[], userName: string) {
		dispatch({
			type: 'ADDBLACKLIST',
			payload: {'segmentTags':segmentTags, 'userName': userName}
		});
	}

	function addWhitelist(segmentTags: Segment[], userName: string) {
		dispatch({
			type: 'ADDWHITELIST',
			payload: {'segmentTags':segmentTags, 'userName': userName}
		});
	}

	return (
		<SegmentTagContext.Provider
			value={{
				blacklist: state.blacklist,
				whitelist: state.whitelist,
				filterlist: state.filterlist,
				setBlacklist,
				setWhitelist,
				setFilterlist,
				deleteBlacklist,
				deleteWhitelist,
				addBlacklist,
				addWhitelist
			}}
		>
			{children}
		</SegmentTagContext.Provider>
	);
};
