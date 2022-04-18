import { Button, createStyles, makeStyles, Paper, TextField, Theme, Typography } from '@material-ui/core';
import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import axios from "axios";
import { ApiUrl } from "../../constants/constants";

import { Title } from '../title/Title';
import { Panel } from '../../models/panel.model';
import { PanelTemplateTable } from '../table/PanelTemplateTable';

import { Font } from '@react-pdf/renderer';
import KAIU from '../../font/KAIU.TTF';
import KAIUBold from '../../font/KAIUBold.TTF';
import TimesNewRoman from '../../font/TimesNewRoman.TTF';
import TimesNewRomanBold from '../../font/TimesNewRomanBold.TTF';
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: 400,
			
		},
		container: {
			display: 'flex',
			flexWrap: 'wrap',
		  },
		  textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
			width: 200,
		  },
    })
);


export const NgsPanelTemplateManagement: FunctionComponent = (prop) => {
	const [panels, setPanels] = useState<Panel[]>([]);
	Font.register({ family: 'KAIU', src: KAIU });
	Font.register({ family: 'KAIUBold', src: KAIUBold });
	Font.register({ family: 'TimesNewRoman', src: TimesNewRoman });
	Font.register({ family: 'TimesNewRomanBold', src: TimesNewRomanBold });
	useEffect(()=>{
        const getPanels = () => {
			try {
				axios(`${ApiUrl}/api/getPanels`).then((res) => {
					setPanels(res.data);
				});
			} catch (error){
				console.log(error);
			}
		}
        getPanels();
    },[]);
	return (
		<React.Fragment>
			<Title>Panel Template Management</Title>
			<PanelTemplateTable data={panels}></PanelTemplateTable>
		</React.Fragment>
	);
};
