import React, { FunctionComponent } from 'react';
import { Route, HashRouter as Router, Switch, Redirect } from 'react-router-dom';
import './App.css';
import { Header } from './components/header/header';
import { Home } from './components/home/Home';
import { NgsAnalysis } from './components/ngs-analysis/NgsAnalysis';
import { NgsResult } from './components/ngs-result/NgsResult';
import { Setting } from './components/setting/Setting';
import { ANALYSIS, HOME, RESULT, SETTING } from './constants/constants';
import { SegmentTagProvider } from './contexts/segmentTag.context';

export const App: FunctionComponent = () => {
	return (
		<Router>
			<SegmentTagProvider>
				<Header>
					<Switch>
						<Route exact path={`${ANALYSIS}`} component={NgsAnalysis} />
						<Route exact path={`${RESULT}`} component={NgsResult} />
						<Route exact path={`${SETTING}`} component={Setting} />
						<Route exact path={`${HOME}`} component={Home} />
					</Switch>
				</Header>
			</SegmentTagProvider>
		</Router>
	);
};
