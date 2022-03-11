import { Connection } from '@jsplumb/core';
import {
  IWorkSpaceConnection,
  IWorkSpaceData,
  IWorkSpaceNode,
} from './interfaces';

export const generateWorkspaceData = (
  exsistingConnections: Array<Connection>,
  exsistingNodes: any
): IWorkSpaceData => {
  let nodes: IWorkSpaceNode[] = [];
  let connections: IWorkSpaceConnection[] = [];
  document.querySelectorAll('.node').forEach((node) => {
    const eleData = exsistingNodes[`${node.id}`];
    nodes.push({
      id: node.id,
      position: {
        x: eleData.viewportElement?.x,
        y: eleData.viewportElement?.y,
      },
    });
  });

  for (let i = 0; i < exsistingConnections.length; i++) {
    const conn = exsistingConnections[i];
    connections.push({
      id: conn.id,
      sourceId: conn.sourceId,
      targetId: conn.targetId,
    });
  }
  return { nodes, connections };
};
export const saveData = (data: IWorkSpaceData): void => {
  localStorage.setItem('workspace', JSON.stringify(data));
};
const dummy = {
  nodes: [
    {
      id: '1',
      position: {
        x: 95,
        y: 225,
      },
    },
    {
      id: '2',
      position: {
        x: 325,
        y: 155,
      },
    },
    {
      id: '3',
      position: {
        x: 598,
        y: 286,
      },
    },
    {
      id: '4',
      position: {
        x: 592,
        y: 100,
      },
    },
    {
      id: '5',
      position: {
        x: 635,
        y: 407,
      },
    },
    {
      id: '6',
      position: {
        x: 911,
        y: 409,
      },
    },
    {
      id: '7',
      position: {
        x: 615,
        y: 505,
      },
    },
    {
      id: '8',
      position: {
        x: 367,
        y: 318,
      },
    },
    {
      id: '9',
      position: {
        x: 582,
        y: 163,
      },
    },
  ],
  connections: [
    {
      id: 'con_22',
      sourceId: '1',
      targetId: '2',
    },
    {
      id: 'con_26',
      sourceId: '1',
      targetId: '8',
    },
    {
      id: 'con_30',
      sourceId: '2',
      targetId: '4',
    },
    {
      id: 'con_34',
      sourceId: '2',
      targetId: '9',
    },
    {
      id: 'con_38',
      sourceId: '8',
      targetId: '3',
    },
    {
      id: 'con_42',
      sourceId: '8',
      targetId: '5',
    },
    {
      id: 'con_46',
      sourceId: '8',
      targetId: '7',
    },
    {
      id: 'con_50',
      sourceId: '5',
      targetId: '6',
    },
  ],
};
export const findHierarchy = () => {
  const connections = dummy.connections;
  let startingPositions: any[] = [];
  let hierarchy: any[] = [];

  // Find First Nodes
  startingPositions.push(...findFirstNodes());
  // For Every First Node build Hierarchy
  for (let i = 0; i < startingPositions.length; i++) {
    let tmp = [];
    const startingElement = startingPositions[i];
    tmp.push([startingElement]);

    let prevLength = -1;
    let length = tmp.length;
    while (prevLength !== length) {
      prevLength = tmp.length;
      const sourceIds = tmp[length - 1];
      const nodes = findNextNodes(sourceIds);
      if (nodes.length > 0) tmp.push(nodes);
      length = tmp.length;
    }
    hierarchy.push(tmp);
  }

  console.log('findHierarchy');
  console.table(hierarchy);
  function findNextNodes(sourceIds: string[]) {
    let tmp: any[] = [];
    sourceIds.forEach((sourceId: string) => {
      const nextNodes = connections
        .filter((con) => con.sourceId == sourceId)
        .map((con) => con.targetId);
      if (nextNodes.length > 0) tmp.push(...nextNodes);
    });
    return tmp;
  }

  function findFirstNodes(): any[] {
    let tmp: any[] = [];
    for (let i = 0; i < connections.length; i++) {
      const { sourceId } = connections[i];
      const sourceExsistInTarget = connections.findIndex(
        (con) => con.targetId === sourceId
      );
      if (sourceExsistInTarget === -1) {
        // avoid duplicates
        const sourceIdExsist = tmp.includes(sourceId);
        if (sourceIdExsist) continue;
        tmp.push(sourceId);
      }
    }
    return tmp;
  }
};
