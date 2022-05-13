import { useState } from "react";

import { AppBar, Avatar, Box, Button, Grid, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Toolbar, Typography } from "@mui/material";
import { DataArray, GridOn, ShowChart, ScatterPlot, Repeat, BarChart } from '@mui/icons-material';
import cloneDeep from 'lodash.clonedeep';


import Workflow from "../components/Workflow";

export interface WorkflowTool {
    name: string;
    freezed: boolean;
    [key: string]: any;
    connected: boolean;
}

export interface WorkflowData {
    dataset?: {id: string, type: string};
    tools: WorkflowTool[];
    connected: boolean;
}

const WorkflowPage: React.FC = () => {
    // create a state to hold the workflow data
    const [workflow, setWorkflow] = useState<WorkflowData>({tools: [], connected: false});

    const addTool = (toolName: string) => {
        // build the workflow tool
        let tool: WorkflowTool;
        if (['dataLoader', 'resultView'].includes(toolName)) {
            tool = {name: toolName, freezed: true, connected: false};
        } else {
            tool = {name: toolName, freezed: false, connected: false};
        }

        // set the new state
        const tools = cloneDeep([...workflow.tools, tool]);
        setWorkflow({...workflow, tools: tools});
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
                        <Button color="inherit" disabled={!workflow.connected}>RUN</Button>
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
                                <ListItemButton onClick={() => addTool('dataLoader')}>
                                    <ListItemAvatar>
                                        <Avatar><DataArray /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Dataset Loader" secondary="Currently 13 datasets available" />
                                </ListItemButton>
                                
                                <ListItemButton disabled={workflow.tools.findIndex(t => t.name === 'dataLoader') < 0} onClick={() => addTool('resample')}>
                                    <ListItemAvatar>
                                        <Avatar><ScatterPlot /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Resample field" secondary="Create a sample from a field" />
                                </ListItemButton>

                                <ListItemButton disabled={workflow.tools.findIndex(t => t.name === 'dataLoader') < 0} onClick={() => addTool('variogram')}>
                                    <ListItemAvatar>
                                        <Avatar><ShowChart /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Estimate variogram" secondary="Estimate a variogram for a sample" />
                                </ListItemButton>

                                <ListItemButton disabled={workflow.tools.findIndex(t => t.name === 'dataLoader') < 0} onClick={() => addTool('kriging')}>
                                    <ListItemAvatar>
                                        <Avatar><GridOn /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Kriging" secondary="Interpolate using Kriging" />
                                </ListItemButton>

                                <ListItemButton disabled={workflow.tools.findIndex(t => t.name === 'dataLoader') < 0} onClick={() => addTool('simulation')}>
                                    <ListItemAvatar>
                                        <Avatar><Repeat /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Simulation" secondary="Run geostatistical simulations" />
                                </ListItemButton>

                                <ListItemButton disabled={workflow.tools.findIndex(t => t.name === 'dataLoader') < 0} onClick={() => addTool('resultView')}>
                                    <ListItemAvatar>
                                        <Avatar><BarChart /></Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary="Result" secondary="Download and inspect the result on Screen" />
                                </ListItemButton>
                            </List>
                        </Box>
                        <Button variant="contained" color="primary" disabled={!workflow.connected}>RUN</Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8} lg={9}>
                    <Paper elevation={5} sx={{height: '100%'}}>
                        <Workflow workflow={workflow} />
                    </Paper>
                </Grid>

            </Grid>
        </>
    );
}

export default WorkflowPage;