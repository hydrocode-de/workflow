from typing import List, Tuple
import os
import hashlib
import subprocess
from itertools import count
from datetime import datetime as dt

from flask import Flask, jsonify, request
from flask_cors import CORS

PORTS = count(42001)
RUNNER_PORTS = {}

"""
{'graph': [{'id': 'dataLoader_0', 'nodes': [{'id': 'resample_1', 'nodes': [{'id': 'variogram_2', 'nodes': [{'id': 'kriging_3', 'nodes': [{'id': 'resultView_4', 'nodes': []}]}, {'id': 'resultView_4', 'nodes': []}]}]}]}], 'graphProps': {'dataLoader_0': {'data_id': '11'}}}
"""

CODE = """
api = API()
results = {}

def base_variogram(dataset):
    data = dataset.data
    if 'x' in data:
        coords = list(zip(data['x'], data['y']))
        vals = list(data['v'])
    else:
        st.error('Currently only works on samples, not on fileds!')
        st.stop()
    
    vario = skg.Variogram(coords, vals)
    return vario
"""

dataLoader = """
{loader_id} = api.get_upload_data(id={data_id})
"""

variogram = """
# get the variogram from parent
{vario_id} = base_variogram({parent_id})

# ask for params
n_lags = st.sidebar.number_input("Number of lags", min_value=1, max_value=100, value=10)

# set parameters
{vario_id}.n_lags = n_lags
"""

# build the app
app = Flask(__name__)
CORS(app, origin="*")
PATH = os.path.abspath(os.path.dirname(__file__))


def graphToPython(graphs: List[dict], graph_props: dict):
    # go for each graph
    imports = "import streamlit as st\nfrom skgstat_uncertainty.api import API\nimport skgstat as skg\n"
    code = CODE

    # main loop
    for graph in graphs:
        # get the dataloader id
        loader_id = graph['id']
        code += dataLoader.format(loader_id=loader_id, data_id=graph_props[loader_id]['data_id'])

        nodes = graph.get('nodes', [])
        for node in nodes:
            imports, code = toolToPython(imports, code, node, graph_props, loader_id)
    
    # finally we should have a messy Python script
    script = f"{imports}\n\n{code}\nst.json(results)"
    return script

def toolToPython(imports: str, code: str, tool: dict, graph_props: dict, parent_id: str) -> Tuple[str, str]:
    # switch tool type
    tool_id = tool['id']
    type_ = tool['id'].split('_')[0]

    if type_ == 'variogram':
        code += variogram.format(parent_id=parent_id, vario_id=tool_id)
    elif type_ == 'resultView':
        # return as result views are handled separatedly
        code += f"# add to results\nresults['{parent_id}'] = {parent_id}\n"
        return imports, code
    else:
        code += f"\n # RUN TOOL {tool_id}\n# NOT IMPLEMENTED YET\n"
    
    # handle nodes
    nodes = tool.get('nodes', [])
    if len(nodes) > 0:
        for node in nodes:
            imports, code = toolToPython(imports, code, node, graph_props, tool_id)
    
    return imports, code


def spawn_runner(script: str):
    # get the hash of the script - TODO use something better here
    script_hash = hashlib.sha256(script.encode()).hexdigest()
    script_path = path = os.path.join(PATH, 'workflows', f"runner_{script_hash}.py")

    # check if this script exists
    if not os.path.exists(script_path):
        with open(script_path, 'w') as f:
            f.write(script)
    
    # check if the script is already served
    if script_hash in RUNNER_PORTS:
        port = RUNNER_PORTS[script_hash]
    else:
        port = next(PORTS)
        # run a new process
        subprocess.Popen(['streamlit', 'run', script_path, '--server.port', str(port), '--server.headless', 'true'])

    info = {
        'port': port,
        'url': f'http://localhost:{port}',
        'hash': script_hash
    }

    return info


@app.route('/build', methods=['POST'])
def build_workflow():
    # get the workflow
    raw = request.json
    
    # get the graph
    graph = raw['graph']
    graph_props = raw['graphProps']

    # create the script
    script = graphToPython(graph, graph_props)

    # spawn the runner
    info = spawn_runner(script)

    return jsonify(info)


if __name__ == '__main__':
    app.run(debug=True)
