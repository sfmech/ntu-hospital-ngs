import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../constants/constants';
import { File } from '../models/file.model';
import { FileReducer } from './files.reducer';
import { User } from '../models/user.model';
// analysis > 0 means how many files analysing

const initialState = {
	user: new User(),
	setUser: (user: User)=>{}
};

export const UserContext = createContext(initialState);

export const UserProvider = ({ children }) => {
	const [ state, dispatch ] = useReducer(FileReducer, initialState);

	
	
	function setUser(user: User) {
        dispatch({
            type: 'SETUSER',
            payload: user
        });
    }
	
	
	return (
		<UserContext.Provider
			value={{
				user: state.user,
				setUser: setUser
			}}
		>
			{children}
		</UserContext.Provider>
	);
};
