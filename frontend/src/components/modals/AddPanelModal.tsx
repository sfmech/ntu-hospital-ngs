import {
	Button,
	createStyles,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Input,
	makeStyles,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Theme,
	Typography
} from '@material-ui/core';
import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import { ApiUrl } from '../../constants/constants';
import AddBoxIcon from '@material-ui/icons/AddBox';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { Sample } from '../../models/sample.model';
import { Disease } from '../../models/disease.model';
import { Autocomplete } from '@material-ui/lab';
import { User } from '../../models/user.model';
import { UserRole } from '../../models/user.role.enum';
import { Panel } from '../../models/panel.model';

type AddPanelModalProps = {
	show: boolean;
	onClose: () => void;
};

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'
		}
	})
);

export const AddPanelModal: FunctionComponent<AddPanelModalProps> = (props) => {
	const classes = useStyles();
	const [ panel, setPanel ] = useState<Panel>(new Panel());
	const [ geneList, setGeneList ] = useState([ { id: 1, gene: '' } ]);
	const [ geneShowConfirm, setGeneShowConfirm ] = React.useState(false);
	const [ geneIndex, setGeneIndex ] = React.useState(0);
	useEffect(()=>{
		setGeneIndex(0);
		setGeneShowConfirm(false);
		setPanel(new Panel());
		setGeneList([ { id: 1, gene: '' } ])
;	},[props.show])
    const hadleAddClick = async () => {
		if (panel?.panelName===undefined){
            alert("Please completely fill the form.")
            return
        }
		panel.genesMethods=panel.genesMethods===undefined?[]:panel.genesMethods;
		panel.biomarker=panel.biomarker===undefined?[]:panel.biomarker;
		panel.methods=panel.methods===undefined?"":panel.methods;
		panel.note1=panel.note1===undefined?"":panel.note1;
		panel.note2=panel.note2===undefined?"":panel.note2;
		panel.technicalNotes=panel.technicalNotes===undefined?"":panel.technicalNotes;


		try {
			panel.genesMethods=geneList.filter((gene)=>gene.gene!=="").map((gene)=> gene.gene);
			await axios.post(`${ApiUrl}/api/addPanel`, {
				data: panel
			});
		} catch (error) {
			console.log(error);
		} finally{
			props.onClose();
			window.location.reload();
        }
    };
	const handleInputChange = (e) => {
		const value = e.target.value;
		const name = e.target.name;
		panel[name] = value;
		setPanel(panel);
	};

	const handleGeneChange = (e, index) => {
		const value = e.target.value;
		const name = e.target.name;
		const list = [ ...geneList ];
		list[index][name] = value;
		setGeneList(list);
	};

	const handleGeneAdd = () => {
		setGeneList([
			...geneList,
			{
				id: geneList.length + 1,
				gene: '',
			}
		]);
	};
	const handleGeneConfirm = (i) => {
		setGeneIndex(i);
		setGeneShowConfirm(true);
	};

	const handleGeneRemoveClick = (i) => {
		console.log(i);
		const list = [ ...geneList ];
		list.splice(i, 1);
		setGeneList(list);
		setGeneShowConfirm(false);
	};

	const handleGeneNo = () => {
		setGeneShowConfirm(false);
	};

	return (
		<Dialog fullWidth={true} maxWidth="xl" open={props.show} onClose={props.onClose}>
			<DialogTitle>Add Panel Template</DialogTitle>
			<DialogContent className={classes.root} dividers>
			<div className="row mt-2">
				<h4 className="text-right">Panel Name:</h4>
				<div className="">
					<Input
						value={panel.panelName}
						name={'panelName'}
						onChange={handleInputChange}
					/>
				</div>
			</div>
			<Typography
				className={'mt-4'}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				II. Genomic Findings:
			</Typography>
			<TextField
						id="outlined-multiline-static"
						label="note1"
						multiline
						rows={4}
						value={panel.note1}
						name={"note1"}
						onChange={handleInputChange}
						variant="outlined"
						style={{ width: '100%' }}
			/>
			<Typography
				className={'mt-4'}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				III. Variants of Unknown Significance: 
			</Typography>
			<TextField
						id="outlined-multiline-static"
						label="note2"
						multiline
						rows={4}
						value={panel.note2}
						name={"note2"}
						onChange={handleInputChange}
						variant="outlined"
						style={{ width: '100%' }}
			/>
			<Typography
				className={'mt-4'}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				IV. Methods:
			</Typography>
			<TextField
						id="outlined-multiline-static"
						label="methods"
						multiline
						rows={7}
						value={panel.methods}
						name={"methods"}
						onChange={handleInputChange}
						variant="outlined"
						style={{ width: '100%' }}
			/>
			<Typography className={' mt-4'} variant="h6" id="tableTitle" component="div">
					Gene List
			</Typography>
			<div className="row">
				<Button className="ml-2" variant="outlined" onClick={handleGeneAdd}>
					<AddBoxIcon onClick={handleGeneAdd} />
					ADD
				</Button>
			</div>
			<Table aria-label="simple table">
				<TableHead>
					<TableRow>
						<TableCell>Gene</TableCell>
						<TableCell align="center">Delete</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{geneList.map((row, i) => {
						return (
							<TableRow>
								<TableCell>
									<input
										value={row.gene}
										name="gene"
										onChange={(e) => handleGeneChange(e, i)}
									/>
								</TableCell>
								<TableCell>
									<Button onClick={() => handleGeneConfirm(i)}>
										<DeleteOutlineIcon />
									</Button>
								</TableCell>

								{geneShowConfirm && (
									<div>
										<Dialog
											open={geneShowConfirm}
											onClose={handleGeneNo}
											aria-labelledby="alert-dialog-title"
											aria-describedby="alert-dialog-description"
										>
											<DialogTitle id="alert-dialog-title">{'Confirm Delete'}</DialogTitle>
											<DialogContent>
												<DialogContentText id="alert-dialog-description">
													Are you sure to delete
												</DialogContentText>
											</DialogContent>
											<DialogActions>
												<Button
													onClick={() => handleGeneRemoveClick(geneIndex)}
													color="primary"
													autoFocus
												>
													Yes
												</Button>
												<Button onClick={handleGeneNo} color="primary" autoFocus>
													No
												</Button>
											</DialogActions>
										</Dialog>
									</div>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
			<Typography
				className={'mt-4'}
				variant="h6"
				id="tableTitle"
				component="div"
			>
				V. Technical Notes:
			</Typography>
			<TextField
						id="outlined-multiline-static"
						label="Note"
						multiline
						rows={7}
						value={panel.technicalNotes}
						name={"technicalNotes"}
						onChange={handleInputChange}
						variant="outlined"
						style={{ width: '100%' }}
			/>
			
			</DialogContent>
			<DialogActions>
				<Button onClick={hadleAddClick} color="primary">
					儲存
				</Button>
				<Button onClick={props.onClose} color="primary">
					取消
				</Button>
			</DialogActions>
		</Dialog>
	);
};
