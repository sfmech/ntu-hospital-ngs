import React, { FunctionComponent } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { Header } from './components/header/header';
import { Home } from './components/home/Home';
import { Login } from './components/login/login';
import { NgsAnalysis } from './components/ngs-analysis/NgsAnalysis';
import { NgsResult } from './components/ngs-result/NgsResult';
import { Setting } from './components/setting/Setting';
import { ANALYSIS, HOME, LOGIN, MEMBERMANAGE, RESULT, SETTING, STATISTIC } from './constants/constants';
import { FileProvider } from './contexts/files.context';
import { ResultProvider } from './contexts/result.context';
import { SegmentTagProvider } from './contexts/segmentTag.context';
import { useCookies } from 'react-cookie';
import { MemberManage } from './components/member-list/MemberManage';
import { CookiesProvider } from 'react-cookie';
import { NgsStatistic } from './components/ngs-statistic/NgsStatistic';

function PrivateRoute ({ children,role, ...rest }) {
	return (
	  <Route {...rest} render={() => {
		return role === 'admin'
		  ? children
		  : <Redirect to={HOME} />
	  }} />
	)
  }
export const App: FunctionComponent = () => {
	const [ cookies ] = useCookies();
	let role: string = cookies['user-role'];
	let token: string = cookies['jwt-auth-token'];
	return (
		<Router>
			<CookiesProvider>
			<ResultProvider>
				<SegmentTagProvider>
					<FileProvider>
						<Header>
							<Switch>
								<Route
									exact
									path="/"
									render={() => {
										return token ? <Redirect to={`${HOME}`} /> : <Redirect to={`${LOGIN}`} />;
									}}
								/>
								<Route exact path={`${ANALYSIS}`} component={NgsAnalysis} />
								<Route exact path={`${RESULT}`} component={NgsResult} />
								<Route path={`${SETTING}`} component={Setting} />
								<Route exact path={`${LOGIN}`}  component={Login} />
								<PrivateRoute path={`${MEMBERMANAGE}`} role={role}>
									<MemberManage />
								</PrivateRoute>
								<PrivateRoute path={`${STATISTIC}`} role={role}>
									<NgsStatistic />
								</PrivateRoute>
								<Route exact path={`${HOME}`} component={Home} />
							</Switch>
						</Header>
					</FileProvider>
				</SegmentTagProvider>
			</ResultProvider>
			</CookiesProvider>
		</Router>
	);
};
