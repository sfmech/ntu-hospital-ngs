import React, { FunctionComponent } from 'react';
import { Title } from '../title/Title';
import './Setting.css';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { FilterListManage } from './filterListManage';
import { SETTING } from '../../constants/constants';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { DiseasesManage } from './diseasesManage';

export const Setting: FunctionComponent = (prop) => {
	const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
	return (
		<React.Fragment>
			<Title>Setting</Title>
			<div className="row">
        <div className="col-2">
            <List>
                <Link to={`${SETTING}/filterlist`} style={{ textDecoration: 'none', color: '#07aad6' }}>
                  <ListItem button classes={{ root: 'MenuItem', selected: 'selected' }} selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemText primary="Filter List" />
                  </ListItem>
                </Link>
                <Link to={`${SETTING}/diseases`} style={{ textDecoration: 'none', color: '#07aad6' }}>
                  <ListItem button classes={{ root: 'MenuItem', selected: 'selected' }} selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                    <ListItemText primary="Diseases" />
                  </ListItem>
                </Link>
            </List>
        </div>
        <div className="col-10">
          <Switch>
            <Route path={`${SETTING}/filterlist`} component={FilterListManage} />
            <Route path={`${SETTING}/diseases`} component={DiseasesManage} />
            <Route exact path={SETTING} component={RedirectToIndex} />
          </Switch>
        </div>
			</div>
			
		</React.Fragment>
	);
};
const RedirectToIndex: FunctionComponent = () => {
	return (
	  <Redirect to={`${SETTING}/filterlist`} />
	);
  }