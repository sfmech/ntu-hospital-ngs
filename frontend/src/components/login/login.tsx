import React, { useReducer, useEffect, FunctionComponent } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import { Title } from '../title/Title';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import { User } from '../../models/user.model';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		container: {
			display: 'flex',
			flexWrap: 'wrap',
			width: 400,
			margin: `${theme.spacing(0)} auto`
		},
		loginBtn: {
			marginTop: theme.spacing(2),
			flexGrow: 1
		},
		header: {
			textAlign: 'center',
			background: '#212121',
			color: '#fff'
		},
		card: {
			marginTop: theme.spacing(10)
		}
	})
);

//state type

type State = {
	user: User;
	isButtonDisabled: boolean;
	helperText: string;
	isError: boolean;
};

const initialState: State = {
	user: new User(),
	isButtonDisabled: true,
	helperText: '',
	isError: false
};

type Action =
	| { type: 'setUsername'; payload: string }
	| { type: 'setPassword'; payload: string }
	| { type: 'setIsButtonDisabled'; payload: boolean }
	| { type: 'loginSuccess'; payload: string }
	| { type: 'loginFailed'; payload: string }
	| { type: 'setIsError'; payload: boolean };

const reducer = (state: State, action: Action): State => {
	switch (action.type) {
		case 'setUsername':
            let setUserName = state.user;
            setUserName.userName = action.payload
			return {
				...state,
				user: setUserName
			};
		case 'setPassword':
            let setUserPassword = state.user;
            setUserPassword.password = action.payload
			return {
				...state,
				user: setUserPassword
			};
		case 'setIsButtonDisabled':
			return {
				...state,
				isButtonDisabled: action.payload
			};
		case 'loginSuccess':
			return {
				...state,
				helperText: action.payload,
				isError: false
			};
		case 'loginFailed':
			return {
				...state,
				helperText: action.payload,
				isError: true
			};
		case 'setIsError':
			return {
				...state,
				isError: action.payload
			};
	}
};

export const Login: FunctionComponent = (prop) => {
	const classes = useStyles();
	const [ state, dispatch ] = useReducer(reducer, initialState);
    const history = useHistory();
	useEffect(
		() => {
			if (state.user.userName.trim() && state.user.password.trim()) {
				dispatch({
					type: 'setIsButtonDisabled',
					payload: false
				});
			} else {
				dispatch({
					type: 'setIsButtonDisabled',
					payload: true
				});
			}
		},
		[ state.user.userName, state.user.password]
	);

	const handleLogin = () => {
        try {
			const response =  axios.post(`${ApiUrl}/auth/login`, {
				data: state.user
            });
            response.then((res)=>{
                if (res.data[0]!==undefined && res.data[0]!=="") {
                    dispatch({
                        type: 'loginSuccess',
                        payload: 'Login Successfully'
                    });
                    history.push('/analysis');
                    window.location.reload();
                } else {
                    dispatch({
                        type: 'loginFailed',
                        payload: 'Incorrect username or password'
                    });
                }
            })
            
		} catch (error) {
			console.log(error);
		} 
		
	};

	const handleKeyPress = (event: React.KeyboardEvent) => {
		if (event.keyCode === 13 || event.which === 13) {
			state.isButtonDisabled || handleLogin();
		}
	};

	const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		dispatch({
			type: 'setUsername',
			payload: event.target.value
		});
	};

	const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
		dispatch({
			type: 'setPassword',
			payload: event.target.value
		});
	};
	return (
		<React.Fragment>
			<Title>Login</Title>
			<form className={classes.container} noValidate autoComplete="off">
				<Card className={classes.card}>
					<CardContent>
						<div>
							<TextField
								error={state.isError}
								fullWidth
								id="username"
								type="email"
								label="Username"
								placeholder="Username"
								margin="normal"
								onChange={handleUsernameChange}
								onKeyPress={handleKeyPress}
							/>
							<TextField
								error={state.isError}
								fullWidth
								id="password"
								type="password"
								label="Password"
								placeholder="Password"
								margin="normal"
								helperText={state.helperText}
								onChange={handlePasswordChange}
								onKeyPress={handleKeyPress}
							/>
						</div>
					</CardContent>
					<CardActions>
						<Button
							variant="contained"
							size="large"
							color="primary"
							className={classes.loginBtn}
							onClick={handleLogin}
							disabled={state.isButtonDisabled}
						>
							Login
						</Button>
					</CardActions>
				</Card>
			</form>
		</React.Fragment>
	);
};
