import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Graph } from "../graph.model";
import { WorkflowTool } from "../pages/WorkflowPage";

export interface WorkflowState {
    tools: WorkflowTool[];
    connected: boolean;
    graph: Graph[];
    graphProps: {[key: string]: {[key: string]: any}};
}

const initialState: WorkflowState = {
    tools: [],
    connected: false,
    graph: [],
    graphProps: {},
};

export const workflowSlice = createSlice({
    name: 'workflow',
    initialState,
    reducers: {
        addTool: (state, action: PayloadAction<WorkflowTool>) => {
            state.tools.push(action.payload);
        },

        setConnected: (state, action: PayloadAction<boolean>) => {
            state.connected = action.payload;
        },

        setGraph: (state, action: PayloadAction<Graph[]>) => {
            state.graph = action.payload;
        },

        updateGraphProps: (state, action: PayloadAction<{tool: string, props: {[key: string]: any}}>) => {
            const toolName = action.payload.tool;
            const toolProps = action.payload.props;

            if (state.graphProps[toolName]) {
                state.graphProps[toolName] = {...state.graphProps[toolName], ...toolProps};
            } else {
                state.graphProps[toolName] = {...toolProps};
            }
        }
    }
});

// Export actions
export const { addTool, setConnected, setGraph, updateGraphProps } = workflowSlice.actions;
export default workflowSlice.reducer;