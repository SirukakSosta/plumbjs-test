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
