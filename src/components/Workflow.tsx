import cloneDeep from 'lodash.clonedeep';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { applyNodeChanges, applyEdgeChanges, addEdge } from 'react-flow-renderer';
import { WorkflowData, WorkflowTool } from '../pages/WorkflowPage';

interface WorkflowProps {
    workflow: WorkflowData;
    onConnectChange: (connected: boolean) => void;
}

const ALLOWED_CONNECTIONS: {[key:string]: string[]} = {
    dataLoader: ['resample', 'variogram', 'resultView'],
    resample: ['variogram', 'resultView'],
    variogram: ['kriging', 'simulation', 'resultView'],
    kriging: ['resample', 'resultView'],
    simulation: ['resample', 'resultView'],
    resultView: []
};

const Workflow: React.FC<WorkflowProps> = ({ workflow, onConnectChange }) => {
    // create a state for nodes and edges
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

    // bind all workflow tools into a graph representation
    useEffect(() => {
        const addNode = (toolName: string, index: number) => {
            const toolId = `${toolName}_${index}`;
            let node: any;

            // check if this tool is already in the nodes
            if (nodes.map(n => n.id).includes(toolId)) {
                node = cloneDeep(nodes.find(n => n.id === toolId));
            } else {
                
                if (toolName === 'dataLoader') {
                    node = {id: toolId, data: {label: 'Data Loader'}, type: 'input', position: {x: 150, y: index * 100}, draggable: true};
                } else if (toolName === 'resultView') {
                    node = {id: toolId, data: {label: 'Result Viewer'}, type: 'output', position: {x: 250, y: workflow.tools.length * 100}, draggable: true}
                } else {
                    node = {id: toolId, data: {label: `Run ${toolName}`}, position: {x: 150, y: index * 100}, draggable: true}
                }
            }
            return node;
        }

        // map over all tools in workflow
        const newNodes = workflow.tools.map((tool, index) => addNode(tool.name, index));
        setNodes(newNodes);

    }, [workflow]);

    // make sure to set the connected state and report to parent.
    useEffect(() => {
        // check if there is any node without connection
        const isConnected = nodes.every(n => edges.some(e => e.target === n.id || e.source === n.id)) && nodes.length > 0 && edges.length > 0;

        // report to parent
        onConnectChange(isConnected);
    }, [nodes, edges, onConnectChange]);

    const onConnect = useCallback(
        (changes: any) => {
            const src: string = changes.source.split('_')[0];
            const tgt: string = changes.target.split('_')[0];
            if (ALLOWED_CONNECTIONS[src].includes(tgt)) {
                setEdges((eds) => addEdge({...changes, animated: true}, eds))
            } else {
                console.log('This connection is not allowed');
            }
            
        },
        [setEdges]
    );

    // Handlers for dragging Nodes and edges
    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nds) => applyNodeChanges(changes, nds))
        },
        [setNodes]
      );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
      );

    return (
        <ReactFlow defaultNodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView />
    );
}

export default Workflow;
