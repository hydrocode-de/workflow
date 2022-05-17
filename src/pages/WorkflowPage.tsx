import { useState } from "react";

import { AppBar, Avatar, Backdrop, Box, Button, CircularProgress, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Toolbar, Typography } from "@mui/material";
import { DataArray, GridOn, ShowChart, ScatterPlot, Repeat, BarChart } from '@mui/icons-material';
import axios from 'axios';


import Workflow from "../components/Workflow";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { addTool } from "../features/workflow";

export interface WorkflowTool {
    name: string;
    freezed: boolean;
    [key: string]: any;
}

export interface WorkflowData {
    dataset?: {id: string, type: string};
    tools: WorkflowTool[];
}

const WorkflowPage: React.FC = () => {
    // get dispatcher
    const dispatch = useDispatch();

    // subscribe to connected state
    const connected = useSelector((state: RootState) => state.workflow.connected);
    const hasDataLoader = useSelector((state: RootState) => state.workflow.tools.findIndex(t => t.name === 'dataLoader') > 0);

    // graph state
    const graphData = useSelector((state: RootState) => ({graph: state.workflow.graph, graphProps: state.workflow.graphProps}))
    const [pending, setPending] = useState<boolean>(false);

    // handler if the user wants a new tool in the workflow
    const onAddTool = (toolName: string) => {
        // build the workflow tool
        let tool: WorkflowTool;
        if (['dataLoader', 'resultView'].includes(toolName)) {
            tool = {name: toolName, freezed: true};
        } else {
            tool = {name: toolName, freezed: false};
        }

        // dispatch the new tool
        dispatch(addTool(tool));
    }

    // run handler
    const onRun = () => {
        // set pending
        setPending(true);

        // send the data to the backend, to create a new workflow
        axios.post('http://localhost:5000/build', graphData)
        .then(res => {
            console.log(res.data);
        })
        .catch(err => console.log(err))
        .finally(() => setPending(false));
    }

    return (
        <>
            {/* Header */}
            <Box sx={{flexGrow: 1}}>
                <AppBar position="sticky" color="primary">
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                            Workflow Builder
                        </Typography>
                        <Button color="inherit" disabled={!connected} onClick={onRun}>RUN</Button>
                    </Toolbar>
                </AppBar>
            </Box>

            {/* Grid */}
            <Grid container spacing={5} sx={{height: 'calc(100vh - 64px)', width: '100vw', pt: 5, pl: 5}}>

                <Grid item xs={12} md={4} lg={3}>
                    <Paper elevation={5} sx={{height: '100%', flexDirection: 'column', justifyContent: 'space-between', display: 'flex'}}>
                        <Box>
                            <Typography variant="h4" component="div" sx={{p: 1}}>
                                Tools
                            </Typography>
                            <List>
                                <ListItemButton onClick={() => onAddTool('dataLoader')}>
                                    <ListItemAvatar>
                                        <Avatar><DataArray /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Dataset Loader" secondary="Currently 13 datasets available" />
                                </ListItemButton>
                                
                                <ListItemButton disabled={hasDataLoader} onClick={() => onAddTool('resample')}>
                                    <ListItemAvatar>
                                        <Avatar><ScatterPlot /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Resample field" secondary="Create a sample from a field" />
                                </ListItemButton>

                                <ListItemButton disabled={hasDataLoader} onClick={() => onAddTool('variogram')}>
                                    <ListItemAvatar>
                                        <Avatar><ShowChart /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Estimate variogram" secondary="Estimate a variogram for a sample" />
                                </ListItemButton>

                                <ListItemButton disabled={hasDataLoader} onClick={() => onAddTool('kriging')}>
                                    <ListItemAvatar>
                                        <Avatar><GridOn /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Kriging" secondary="Interpolate using Kriging" />
                                </ListItemButton>

                                <ListItemButton disabled={hasDataLoader} onClick={() => onAddTool('simulation')}>
                                    <ListItemAvatar>
                                        <Avatar><Repeat /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Simulation" secondary="Run geostatistical simulations" />
                                </ListItemButton>

                                <ListItemButton disabled={hasDataLoader} onClick={() => onAddTool('resultView')}>
                                    <ListItemAvatar>
                                        <Avatar><BarChart /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Result" secondary="Download and inspect the result on Screen" />
                                </ListItemButton>
                            </List>
                        </Box>
                        <Button variant="contained" color="primary" disabled={!connected} onClick={onRun}>RUN</Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                    <Paper elevation={5} sx={{height: '100%'}}>
                        <Workflow />
                    </Paper>
                </Grid>

            </Grid>

            {/* Backdrop */}
            <Backdrop sx={{color: '#fff', zIndex: 99}} open={pending}>
                <CircularProgress color="inherit" />
            </Backdrop> 
        </>
    );
}

export default WorkflowPage;