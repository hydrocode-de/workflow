import cloneDeep from 'lodash.clonedeep';
import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { applyNodeChanges, applyEdgeChanges, addEdge } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { setConnected, setGraph, updateGraphProps } from '../features/workflow';
import { Graph } from '../graph.model';
import { RootState } from '../store';

// import tools
import DataLoaderTool from './DataLoaderTool';


const ALLOWED_CONNECTIONS: {[key:string]: string[]} = {
    dataLoader: ['resample', 'variogram', 'resultView'],
    resample: ['variogram', 'resultView'],
    variogram: ['kriging', 'simulation', 'resultView'],
    kriging: ['resample', 'resultView'],
    simulation: ['resample', 'resultView'],
    resultView: []
};

const Workflow: React.FC = () => {
    // subscribe to workflow tools
    const tools = useSelector((state: RootState) => state.workflow.tools);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // create a dispatcher
    const dispatch = useDispatch();

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
                    node = {
                        id: toolId,
                        data: {label: <DataLoaderTool onChange={opts => dispatch(updateGraphProps({tool: toolId, props: opts}))} />}, 
                        type: 'input', position: {x: Math.floor(Math.random() * 500), y: 50}, 
                        draggable: true
                    };
                } else if (toolName === 'resultView') {
                    node = {id: toolId, data: {label: 'Result Viewer'}, type: 'output', position: {x: Math.floor(Math.random() * 500), y: 50}, draggable: true}
                } else {
                    node = {id: toolId, data: {label: `Run ${toolName}`}, position: {x: Math.floor(Math.random() * 500), y: 50}, draggable: true}
                }
            }
            return node;
        }

        // map over all tools in workflow
        const newNodes = tools.map((tool, index) => addNode(tool.name, index));
        setNodes(newNodes);

    }, [tools, dispatch]);

    // make sure to set the connected state and report to parent.
    useEffect(() => {
        // check if there is any node without connection
        const isConnected = nodes.every(n => edges.some(e => e.target === n.id || e.source === n.id)) && nodes.length > 0 && edges.length > 0;

        // report to parent
        dispatch(setConnected(isConnected));
        setIsConnected(isConnected);
    }, [nodes, edges, dispatch]);

    
    
    useEffect(() => {
        // build a graph based on the current state of nodes and edges
        const nodeToGraphLeaf = (node: any): Graph | null => {
            if (node) {
                return {
                    id: node.id,
                    nodes: edges.filter(e => e.source===node.id).map(e => nodeToGraphLeaf(nodes.find(n => n.id===e.target)))
                }
            } else {
                return null
            }
        }
        
        // RUN THIS only if connected
        if (isConnected) {
            console.log('building graphs');
            const graphs: Graph[] = [];
        
            // iterate over all nodes to find each dataloader
            nodes.forEach(node => {
                if (node.id.includes('dataLoader')) {
                    const graph: Graph | null = nodeToGraphLeaf(node);
                    if (graph) {
                        graphs.push(graph);
                    }
                }
            });
            console.log(graphs);
            // dispatch the new graph
            dispatch(setGraph(graphs));
        }

    }, [dispatch, isConnected, nodes, edges]);
    

    const onConnect = useCallback(
        (changes: any) => {
            const src: string = changes.source.split('_')[0];
            const tgt: string = changes.target.split('_')[0];
            if (ALLOWED_CONNECTIONS[src].includes(tgt)) {
                // update the edges on the workflow
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
