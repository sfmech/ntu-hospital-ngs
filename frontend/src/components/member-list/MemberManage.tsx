import React, { FunctionComponent } from 'react';
import { Title } from '../title/Title';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import { MEMBERMANAGE, SETTING } from '../../constants/constants';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { UsersManage } from './UserManage';
import { HealthCareWorkersManage } from './HealthCareWorkersManage';


export const MemberManage: FunctionComponent = (prop) => {
	const [selectedIndex, setSelectedIndex] = React.useState(1);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
	return (
		<React.Fragment>
      <Title>Member Manage</Title>
			<div className="row">
        <div className="col-2">
            <List>
                <Link to={`${MEMBERMANAGE}/usersmanage`} style={{ textDecoration: 'none', color: '#07aad6' }}>
                  <ListItem button classes={{ root: 'MenuItem', selected: 'selected' }} selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                    <ListItemText primary="Users Manage" />
                  </ListItem>
                </Link>
            </List>
        </div>
        <div className="col-10">
          <Switch>
            <Route path={`${MEMBERMANAGE}/usersmanage`} component={UsersManage} />
            <Route exact path={MEMBERMANAGE} component={RedirectToIndex} />
          </Switch>
        </div>
			</div>
			
		</React.Fragment>
	);
};
const RedirectToIndex: FunctionComponent = () => {
	return (
	  <Redirect to={`${MEMBERMANAGE}/usersmanage`} />
	);
  }