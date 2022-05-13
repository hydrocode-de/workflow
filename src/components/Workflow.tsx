import cloneDeep from 'lodash.clonedeep';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { applyNodeChanges, applyEdgeChanges, addEdge } from 'react-flow-renderer';
import { WorkflowData, WorkflowTool } from '../pages/WorkflowPage';

interface WorkflowProps {
    workflow: WorkflowData;
}

const ALLOWED_CONNECTIONS: {[key:string]: string[]} = {
    dataLoader: ['resample', 'variogram', 'result'],
    resample: ['variogram', 'result'],
    variogram: ['kriging', 'simulation', 'result'],
    kriging: ['resample', 'result'],
    simulation: ['resample', 'result'],
    result: []
};

const Workflow: React.FC<WorkflowProps> = ({ workflow }) => {
    // create a state for nodes and edges
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);

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