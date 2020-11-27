import { File } from "../models/file.model";
import axios from 'axios';
import { ApiUrl } from '../constants/constants';

export const FileReducer = (state, action) => {
	switch (action.type) {
		case 'SETFILES':
			return {
				...state,
				files: action.payload
			};
		case 'SETANALYSIS':
			return{
				...state,
				analysis: action.payload
			}
		case 'UPDATEFILE':
			const updatedFile = action.payload as File;
			
            const updatedFiles = state.files.map((file: File) => {
                if (file.name.split("_")[0] === updatedFile.name.split("_")[0]){
					updatedFile.name = `${updatedFile.name.split("_")[0]}_${updatedFile.disease.enName}`
					try {
						const response = axios.post(`${ApiUrl}/api/updateFile`,{
							oldSampleName:file.name,
							newSampleName:updatedFile.name
						});
					} catch (error) {
						console.log(error);
					}
					return updatedFile
				}
                return file;
            });
			return{
				...state,
				files: updatedFiles
			}
		default:
			return state;
	}
};
