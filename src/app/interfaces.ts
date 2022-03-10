type NodeTypes = 'TypeA' | 'TypeB';
export interface IInitialNodeData {
  id: string;
  name: string;
  metadata: any;
  type: NodeTypes;
}
export interface IWorkSpaceData {
  connections: IWorkSpaceConnection[];
  nodes: IWorkSpaceNode[];
}
export interface IWorkSpaceNode {
  id: string;
  position: {
    x: number;
    y: number;
  };
}
export interface IWorkSpaceConnection {
  id: string;
  sourceId: string;
  targetId: string;
}
