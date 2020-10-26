import Divider from '@material-ui/core/Divider';
import React, { FunctionComponent } from 'react';
import './Title.css';

export const Title: FunctionComponent = (prop) => {
	return (
		<React.Fragment>
			<div className="row title mx-3">
				<strong>{prop.children}</strong>
			</div>
			<Divider className="mt-2"/>
		</React.Fragment>
	);
};
