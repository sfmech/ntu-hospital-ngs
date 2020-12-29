import { File } from "../models/file.model";
import axios from 'axios';
import { ApiUrl } from '../constants/constants';

export const UserReducer = (state, action) => {
	switch (action.type) {
		case 'SETUSER':
			return {
				...state,
				files: action.payload
			};
		default:
			return state;
	}
};
