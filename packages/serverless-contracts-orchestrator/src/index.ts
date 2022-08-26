/* eslint-disable max-lines */
import { readFile } from 'fs/promises';
import { glob } from 'glob';
import { digraph, Graph, Node, RenderOptions } from 'graphviz';
import { diffSchemas } from 'json-schema-diff';
import { JSONSchema } from 'json-schema-to-ts';

interface ServerlessContractSchemas {
  provides: Record<string, JSONSchema>;
  consumes: Record<string, JSONSchema>;
}
interface ListOfContractSchemas {
  localContractSchemas?: ServerlessContractSchemas;
  remoteContractSchemas?: ServerlessContractSchemas;
}

type ContractNodes = Record<
  string,
  {
    deployFirst: Node[];
    deployLast: Node[];
  }
>;

interface ContractsByDeploymentOrder {
  deployFirst: string[];
  deployLast: string[];
}

type ListOfServiceContracts = {
  node: Node;
  contractsByDeploymentOrder: ContractsByDeploymentOrder;
}[];

interface AddToContractsByDeploymentOrderParam {
  contractsByDeploymentOrder: ContractsByDeploymentOrder;
  data: ListOfContractSchemas;
  action: 'provides' | 'consumes';
}

type ServiceRequirements = Record<string, string[]>;

interface ComputeDepthRecordParam {
  id: string;
  nodes: ServiceRequirements;
  depthRecord: Record<string, number>;
  unresolved: Record<string, boolean>;
}

enum NodeColors {
  CYCLIC_DEPENDENCY_COLOR = '#ff6c60',
  NO_REQUIREMENTS_COLOR = '#cfffac',
  DEFAULT_COLOR = '#c6c5fe',
}
const graphvizOptions: RenderOptions = {
  G: {
    overlap: false,
    pad: 0.3,
    rankdir: 'LR',
    layout: 'dot',
    bgcolor: '#111111',
  },
  E: {
    color: '#757575',
    fontcolor: '#ffffff',
    fontname: 'Arial',
    fontsize: '12px',
  },
  N: {
    fontname: 'Arial',
    fontsize: '14px',
    fontcolor: NodeColors.DEFAULT_COLOR,
    color: NodeColors.DEFAULT_COLOR,
    shape: 'box',
    style: 'rounded',
    height: 0,
  },
  type: 'png',
};

const computeNodeDepthRecord = ({
  id,
  nodes,
  depthRecord,
  unresolved,
}: ComputeDepthRecordParam): number => {
  if (nodes[id].length === 0) {
    depthRecord[id] = 0;

    return 0;
  }

  unresolved[id] = true;
  let max = 0;
  nodes[id].forEach(requirement => {
    if (!isNaN(depthRecord[requirement])) {
      max = Math.max(max, depthRecord[requirement]);

      return;
    }
    if (unresolved[requirement]) {
      depthRecord[requirement] = Infinity;
      max = Infinity;

      return;
    }
    max = Math.max(
      max,
      computeNodeDepthRecord({
        id: requirement,
        nodes,
        depthRecord,
        unresolved,
      }),
    );
  });

  depthRecord[id] = max + 1;
  unresolved[id] = false;

  return depthRecord[id];
};

const computeDepthRecord = (
  nodes: ServiceRequirements,
): Record<string, number> => {
  const depthRecord = {};
  const unresolved = {};

  Object.keys(nodes).forEach(id => {
    computeNodeDepthRecord({ id, depthRecord, nodes, unresolved });
  });

  return depthRecord;
};

const setNodeColor = (node: Node, color: string) => {
  node.set('color', color);
  node.set('fontcolor', color);
};

const depthToColor = (depth: number): NodeColors => {
  switch (depth) {
    case Infinity:
      return NodeColors.CYCLIC_DEPENDENCY_COLOR;
    case 0:
      return NodeColors.NO_REQUIREMENTS_COLOR;
    default:
      return NodeColors.DEFAULT_COLOR;
  }
};

const getServiceContractsByDeploymentOrder = async (
  listOfContractSchemas: ListOfContractSchemas,
) => {
  const contractsByDeploymentOrder: ContractsByDeploymentOrder = {
    deployFirst: [],
    deployLast: [],
  };

  await addToContractsByDeploymentOrder({
    contractsByDeploymentOrder,
    data: listOfContractSchemas,
    action: 'provides',
  });
  await addToContractsByDeploymentOrder({
    contractsByDeploymentOrder,
    data: listOfContractSchemas,
    action: 'consumes',
  });

  return contractsByDeploymentOrder;
};

const addToContractsByDeploymentOrder = async ({
  contractsByDeploymentOrder,
  data,
  action,
}: AddToContractsByDeploymentOrderParam) => {
  const contractNames = Array.from(
    new Set([
      ...Object.keys(data.localContractSchemas?.[action] ?? {}),
      ...Object.keys(data.remoteContractSchemas?.[action] ?? {}),
    ]),
  );

  const additionsOrder = action === 'provides' ? 'deployFirst' : 'deployLast';
  const removalsOrder = action === 'provides' ? 'deployLast' : 'deployFirst';

  await Promise.all(
    contractNames.map(async contractName => {
      if (data.localContractSchemas?.[action][contractName] === undefined) {
        contractsByDeploymentOrder[removalsOrder].push(contractName);

        return;
      }
      if (data.remoteContractSchemas?.[action][contractName] === undefined) {
        contractsByDeploymentOrder[additionsOrder].push(contractName);

        return;
      }
      const { additionsFound, removalsFound } = await diffSchemas({
        // @ts-ignore this is not well typed
        sourceSchema: data.remoteContractSchemas[action][contractName],
        // @ts-ignore this is not well typed
        destinationSchema: data.localContractSchemas[action][contractName],
      });
      if (additionsFound) {
        contractsByDeploymentOrder[additionsOrder].push(contractName);
      }

      if (removalsFound) {
        contractsByDeploymentOrder[removalsOrder].push(contractName);
      }
    }),
  );
};

const processFile = (
  graph: Graph,
  serviceRequirements: ServiceRequirements,
) => {
  return async (file: string) => {
    const node = graph.addNode(file.split('/').slice(0, 2).join('_'));
    serviceRequirements[node.id] = [];
    const data = JSON.parse(
      (await readFile(file)).toString(),
    ) as ListOfContractSchemas;

    const contractsByDeploymentOrder =
      await getServiceContractsByDeploymentOrder(data);

    return {
      node,
      contractsByDeploymentOrder,
    };
  };
};

const inverseServicesByContracts = (
  serviceContracts: ListOfServiceContracts,
) => {
  const contractNodes = serviceContracts
    .flatMap(({ contractsByDeploymentOrder }) => [
      ...contractsByDeploymentOrder.deployFirst,
      ...contractsByDeploymentOrder.deployLast,
    ])
    .reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: { deployFirst: [], deployLast: [] },
      }),
      {} as ContractNodes,
    );

  for (const { contractsByDeploymentOrder, node } of serviceContracts) {
    contractsByDeploymentOrder.deployFirst.forEach(contractName => {
      contractNodes[contractName].deployFirst.push(node);
    });
    contractsByDeploymentOrder.deployLast.forEach(contractName => {
      contractNodes[contractName].deployLast.push(node);
    });
  }

  return contractNodes;
};

const main = async (): Promise<void> => {
  const graph = digraph('ContractDependencies');
  const serviceRequirements: ServiceRequirements = {};

  const serviceContracts = await new Promise<ListOfServiceContracts>(
    (resolve, reject) => {
      glob('backend/**/.swarmion/contracts.json', (err, matches) => {
        if (err) {
          reject(err);
        }
        resolve(
          Promise.all(matches.map(processFile(graph, serviceRequirements))),
        );
      });
    },
  );

  const contractNodes = inverseServicesByContracts(serviceContracts);

  Object.entries(contractNodes).map(
    ([contractName, { deployFirst, deployLast }]) => {
      deployFirst.map(nodeFirst => {
        deployLast.map(nodeLast => {
          if (nodeFirst === nodeLast) {
            return;
          }
          graph.addEdge(nodeFirst, nodeLast).set('label', contractName);
          serviceRequirements[nodeLast.id].push(nodeFirst.id);
        });
      });
    },
  );

  const depthRecord = computeDepthRecord(serviceRequirements);

  Object.entries(depthRecord).map(([nodeId, depth]) => {
    setNodeColor(graph.getNode(nodeId), depthToColor(depth));
  });

  graph.output(
    graphvizOptions,
    'contractDependencies.png',
    (code, stdout, stderr) => console.error({ code, stdout, stderr }),
  );

  if (
    Object.values(depthRecord).filter(value => value === Infinity).length > 0
  ) {
    console.error('There is a breaking change in your contracts !!!');

    return;
  }

  const deploymentStrategy: Record<number, string[]> = {};
  Object.entries(depthRecord).forEach(([serviceName, depth]) => {
    if (!(depth in Object.keys(deploymentStrategy))) {
      deploymentStrategy[depth] = [];
    }
    deploymentStrategy[depth].push(serviceName);
  });
  console.log(deploymentStrategy);
};

void main();
